import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/api/post';
import { postKeys } from '@/hooks/queries/usePosts';
import { useToast } from '@/hooks/useToast';

export const usePostDelete = (postId: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const handleDeletePost = async () => {
    if (!postId || isDeletingPost) return;

    try {
      setIsDeletingPost(true);
      const response = await deletePost(postId);

      if (response.code !== 0) {
        showToast({ type: 'error', message: '삭제에 실패했습니다.' });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: postKeys.all });
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      showToast({ type: 'error', message: '삭제에 실패했습니다.' });
      return;
    } finally {
      setIsDeletingPost(false);
    }

    sessionStorage.removeItem(`post-preview:${postId}`);
    setIsDeleteModalOpen(false);
    showToast({ type: 'success', message: '삭제되었습니다!' });
    navigate('/');
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeletingPost,
    handleDeletePost,
  };
};
