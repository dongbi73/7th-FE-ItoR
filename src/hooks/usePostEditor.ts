import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createPostRequestBody, type PostDetail } from '@/api/post';
import { useToast } from '@/hooks/useToast';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useEditorBlocks } from '@/hooks/useEditorBlocks';
import {
  useCreatePostMutation,
  usePostDetailQuery,
  useUpdatePostMutation,
} from '@/hooks/queries/usePosts';

export const usePostEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [editingPost, setEditingPost] = useState<PostDetail | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToastRef = useRef(showToast);
  const initializedPostIdRef = useRef<string | null>(null);
  const {
    blocks,
    openedDropDownId,
    setOpenedDropDownId,
    firstTextRef,
    firstTextBlockId,
    hasTextContent,
    applyContentsToBlocks,
    insertImageBlock,
    handleTextChange,
    handleDeleteBlock,
    rememberTextSelection,
    registerTextArea,
  } = useEditorBlocks();

  const { isLoggedIn } = useAuthStatus();
  const isEditMode = !!postId;
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation(postId, isLoggedIn);
  const { data: editingPostData, isError: isEditingPostError } = usePostDetailQuery({
    postId,
    isLoggedIn,
  });
  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;
  const { uploadImageFile } = useImageUpload();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    firstTextRef.current?.focus();
  }, [firstTextRef, isLoggedIn, navigate]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    if (!isLoggedIn || !postId) return;

    if (!editingPostData || initializedPostIdRef.current === postId) return;

    setEditingPost(editingPostData);
    setTitle(editingPostData.title);
    applyContentsToBlocks(editingPostData.contents);
    initializedPostIdRef.current = postId;
  }, [applyContentsToBlocks, editingPostData, isLoggedIn, postId]);

  useEffect(() => {
    if (!isEditingPostError || !postId) return;

    showToastRef.current({ type: 'error', message: '게시글을 불러오지 못했습니다.' });
    navigate(`/post/${postId}`);
  }, [isEditingPostError, navigate, postId]);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImageFile(event.target.files?.[0]);

    if (imageUrl) {
      insertImageBlock(imageUrl);
    }

    event.target.value = '';
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
