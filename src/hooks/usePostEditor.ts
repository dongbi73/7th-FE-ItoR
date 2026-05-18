import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  createPostRequestBody,
  type EditorBlock,
  type PostDetail,
} from '@/api/post';
import { useToast } from '@/hooks/useToast';
import { useImageUpload } from '@/hooks/useImageUpload';
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

const INITIAL_TEXT_BLOCK: EditorBlock = { id: 'initial-id', type: 'TEXT', value: '' };

export const usePostEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<EditorBlock[]>([INITIAL_TEXT_BLOCK]);
  const [editingPost, setEditingPost] = useState<PostDetail | null>(null);
  const [openedDropDownId, setOpenedDropDownId] = useState<string | null>(null);
  const [focusTextBlockId, setFocusTextBlockId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const firstTextRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToastRef = useRef(showToast);
  const textAreaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const lastTextSelectionRef = useRef<TextSelection | null>(null);

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

  const { uploadImageFile } = useImageUpload();

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
        : [INITIAL_TEXT_BLOCK],
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

  const insertImageBlock = (imageUrl: string) => {
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
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImageFile(event.target.files?.[0]);

    if (imageUrl) {
      insertImageBlock(imageUrl);
    }

    event.target.value = '';
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

  const registerTextArea = (blockId: string, index: number) => {
    return (textarea: HTMLTextAreaElement | null) => {
      if (textarea) {
        textAreaRefs.current.set(blockId, textarea);

        if (index === 0) {
          firstTextRef.current = textarea;
        }

        resizeTextarea(textarea);
      } else {
        textAreaRefs.current.delete(blockId);
      }
    };
  };

  const createPreviewDetail = (previewPostId: string): PostDetail => ({
    postId: previewPostId,
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
        showToast({ type: 'error', message: '저장에 실패했습니다.' });
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
      showToast({ type: 'error', message: '저장에 실패했습니다.' });
    }
  };

  return {
    title,
    setTitle,
    titleRef,
    blocks,
    fileInputRef,
    openedDropDownId,
    setOpenedDropDownId,
    firstTextBlockId,
    hasTextContent,
    handleAddPhotoClick,
    handleFileChange,
    handleTextChange,
    handleDeleteBlock,
    handleSubmit,
    isSubmitting,
    rememberTextSelection,
    registerTextArea,
  };
};
