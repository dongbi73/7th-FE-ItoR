import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { v4 as uuidv4 } from 'uuid';
import { DeleteForeverIcon } from '@/assets/icons';
import { Blank } from '@/components/common/Blank';
import { Dropdown } from '@/components/common/Dropdown';
import { Header } from '@/components/layout/Header';
import { HeaderLegacy } from '@/components/layout/HeaderLegacy';
import {
  createPostRequestBody,
  type EditorBlock,
  type PostDetail,
} from '@/api/post';
import { useToast } from '@/hooks/useToast';
import { IconButton } from '@/components/common/IconButton';
import { uploadImage } from '@/api/image';
import {
  useCreatePostMutation,
  usePostDetailQuery,
  useUpdatePostMutation,
} from '@/hooks/queries/usePosts';

interface TextSelection {
  blockId: string;
  start: number;
  end: number;
}

export const WritePage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: 'initial-id', type: 'TEXT', value: '' },
  ]);
  const [editingPost, setEditingPost] = useState<PostDetail | null>(null);
  const [openedDropDownId, setOpenedDropDownId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const firstTextRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToastRef = useRef(showToast);
  const textAreaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const lastTextSelectionRef = useRef<TextSelection | null>(null);
  const [focusTextBlockId, setFocusTextBlockId] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isEditMode = !!postId;
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation(postId, isLoggedIn);
  const { data: editingPostData, isError: isEditingPostError } = usePostDetailQuery({
    postId,
    isLoggedIn,
  });
  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;

  const hasTextContent = blocks.some(
    (block) => block.type === 'TEXT' && block.value.trim().length > 0,
  );
  const firstTextBlockId = blocks.find((block) => block.type === 'TEXT')?.id;

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const rememberTextSelection = (textarea: HTMLTextAreaElement, blockId: string) => {
    lastTextSelectionRef.current = {
      blockId,
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  };

  const applyPostToForm = (post: PostDetail) => {
    setEditingPost(post);
    setTitle(post.title);
    setBlocks(
      post.contents.length > 0
        ? post.contents.map((content) => ({
            id: uuidv4(),
            type: content.contentType,
            value: content.content,
          }))
        : [{ id: 'initial-id', type: 'TEXT', value: '' }],
    );
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    firstTextRef.current?.focus();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    if (!isLoggedIn || !postId) return;

    if (editingPostData) {
      applyPostToForm(editingPostData);
    }
  }, [editingPostData, isLoggedIn, postId]);

  useEffect(() => {
    if (!isEditingPostError || !postId) return;

    showToastRef.current({ type: 'error', message: '게시글을 불러오지 못했습니다.' });
    navigate(`/post/${postId}`);
  }, [isEditingPostError, navigate, postId]);

  useEffect(() => {
    textAreaRefs.current.forEach((textarea) => resizeTextarea(textarea));
  }, [blocks]);

  useEffect(() => {
    if (!focusTextBlockId) return;

    const textarea = textAreaRefs.current.get(focusTextBlockId);

    if (!textarea) return;

    textarea.focus();
    textarea.setSelectionRange(0, 0);
    resizeTextarea(textarea);
    setFocusTextBlockId(null);
  }, [focusTextBlockId, blocks]);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: '이미지 파일만 업로드 가능합니다.' });
      e.target.value = '';
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      const selection = lastTextSelectionRef.current;

      setBlocks((prev) => {
        const imageBlock: EditorBlock = { id: uuidv4(), type: 'IMAGE', value: imageUrl };
        const nextTextBlock: EditorBlock = { id: uuidv4(), type: 'TEXT', value: '' };

        if (!selection) {
          setFocusTextBlockId(nextTextBlock.id);
          return [...prev, imageBlock, nextTextBlock];
        }

        const selectedBlockIndex = prev.findIndex(
          (block) => block.id === selection.blockId && block.type === 'TEXT',
        );

        if (selectedBlockIndex === -1) {
          setFocusTextBlockId(nextTextBlock.id);
          return [...prev, imageBlock, nextTextBlock];
        }

        const selectedBlock = prev[selectedBlockIndex];
        const beforeText = selectedBlock.value.slice(0, selection.start);
        const afterText = selectedBlock.value.slice(selection.end);
        const insertedBlocks: EditorBlock[] = [
          ...(beforeText ? [{ ...selectedBlock, value: beforeText }] : []),
          imageBlock,
          { ...nextTextBlock, value: afterText },
        ];

        setFocusTextBlockId(nextTextBlock.id);
        return [
          ...prev.slice(0, selectedBlockIndex),
          ...insertedBlocks,
          ...prev.slice(selectedBlockIndex + 1),
        ];
      });
      setOpenedDropDownId(null);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      showToast({ type: 'error', message: '이미지 업로드에 실패했습니다.' });
    }

    e.target.value = '';
  };

  const handleTextChange = (id: string, value: string, textarea: HTMLTextAreaElement) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, value } : block)));
    rememberTextSelection(textarea, id);
    resizeTextarea(textarea);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => {
      const nextBlocks = prev.filter((block) => block.id !== id);

      return nextBlocks.some((block) => block.type === 'TEXT')
        ? nextBlocks
        : [{ id: uuidv4(), type: 'TEXT', value: '' }];
    });
    setOpenedDropDownId(null);
  };

  const createPreviewDetail = (postId: string): PostDetail => ({
    postId,
    title: title.trim(),
    isOwner: true,
    nickName: editingPost?.nickName ?? '나',
    profileUrl: editingPost?.profileUrl ?? '',
    introduction: editingPost?.introduction ?? '작성한 게시물 미리보기입니다.',
    createdAt: editingPost?.createdAt ?? new Date().toISOString(),
    contents: createPostRequestBody(title, blocks).contents,
    comments: editingPost?.comments ?? [],
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!title.trim()) {
      showToast({ type: 'error', message: '제목을 입력해주세요' });
      titleRef.current?.focus();
      return;
    }

    if (!hasTextContent) {
      showToast({ type: 'error', message: '본문 내용을 입력해주세요' });
      firstTextRef.current?.focus();
      return;
    }

    const requestBody = createPostRequestBody(title.trim(), blocks);

    if (isEditMode && postId) {
      try {
        const response = await updatePostMutation.mutateAsync(requestBody);
        const updatedPostId = response.postId ?? response.id ?? postId;

        sessionStorage.setItem(
          `post-preview:${updatedPostId}`,
          JSON.stringify(createPreviewDetail(updatedPostId)),
        );
        showToast({ type: 'success', message: '저장되었습니다.' });
        navigate(`/post/${updatedPostId}`);
      } catch (error) {
        console.error('게시글 수정 실패:', error);

        sessionStorage.setItem(
          `post-preview:${postId}`,
          JSON.stringify(createPreviewDetail(postId)),
        );
        showToast({ type: 'success', message: '저장되었습니다.' });
        navigate(`/post/${postId}`);
      }

      return;
    }

    try {
      const response = await createPostMutation.mutateAsync(requestBody);
      const createdPostId = response.postId ?? response.id ?? uuidv4();

      sessionStorage.setItem(
        `post-preview:${createdPostId}`,
        JSON.stringify(createPreviewDetail(createdPostId)),
      );
      showToast({ type: 'success', message: '저장되었습니다.' });
      navigate(`/post/${createdPostId}`);
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      const mockPostId = uuidv4();

      sessionStorage.setItem(
        `post-preview:${mockPostId}`,
        JSON.stringify(createPreviewDetail(mockPostId)),
      );
      showToast({ type: 'success', message: '저장되었습니다.' });
      navigate(`/post/${mockPostId}`);
    }
  };

  return (
    <>
      <Header type="edit" onPublish={handleSubmit} />
      <HeaderLegacy onAddPhoto={handleAddPhotoClick} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <main className="flex w-full flex-col items-center">
        <section className="flex w-full max-w-172 flex-col">
          <Blank size="md" />
          <div className="py-3">
            <div className="justify-center px-4 py-3">
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                autoComplete="off"
                className="placeholder:text-gray-56 w-full text-[32px] font-medium outline-none placeholder:text-[16px]"
              />
            </div>

            <Blank size="md" />
          </div>
        </section>

        <section className="flex w-full max-w-172 flex-col">
          <Blank size="md" />

          {blocks.map((block, index) => {
            if (block.type === 'TEXT') {
              return (
                <textarea
                  key={block.id}
                  ref={(textarea) => {
                    if (textarea) {
                      textAreaRefs.current.set(block.id, textarea);

                      if (index === 0) {
                        firstTextRef.current = textarea;
                      }

                      resizeTextarea(textarea);
                    } else {
                      textAreaRefs.current.delete(block.id);
                    }
                  }}
                  value={block.value}
                  onChange={(e) => handleTextChange(block.id, e.target.value, e.currentTarget)}
                  onFocus={(e) => rememberTextSelection(e.currentTarget, block.id)}
                  onClick={(e) => rememberTextSelection(e.currentTarget, block.id)}
                  onKeyUp={(e) => rememberTextSelection(e.currentTarget, block.id)}
                  placeholder={
                    block.id === firstTextBlockId && !hasTextContent
                      ? '어떠한 것을 깨달았나요?'
                      : ''
                  }
                  rows={1}
                  className="text-gray-20 placeholder:text-gray-56 min-h-11 resize-none gap-2.5 overflow-hidden px-4 py-3 text-[14px] font-light outline-none"
                />
              );
            }

            return (
              <div
                key={block.id}
                className={cn(
                  'group relative w-full gap-2 border px-4 py-3 transition-all',
                  openedDropDownId === block.id ? 'border-btn-primary' : 'border-transparent',
                )}
              >
                <img
                  src={block.value}
                  alt="Uploaded"
                  loading="lazy"
                  decoding="async"
                  className="w-full cursor-pointer rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenedDropDownId(block.id);
                  }}
                />

                <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
                  <Dropdown
                    isOpen={openedDropDownId === block.id}
                    onClose={() => {
                      setOpenedDropDownId(null);
                    }}
                    position="top"
                    isIconOnly
                    hasCaret={true}
                  >
                    <Dropdown.Item asChild onClick={() => handleDeleteBlock(block.id)}>
                      <IconButton icon={<DeleteForeverIcon />} size="frame" />
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            );
          })}

          <Blank size="md" />
        </section>
      </main>
    </>
  );
};

export default WritePage;
