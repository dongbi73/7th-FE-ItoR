import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '@/hooks/queries/usePosts';
import { useToast } from '@/hooks/useToast';

export const useCommentActions = (postId: string | undefined, isLoggedIn: boolean) => {
  const { showToast } = useToast();
  const createCommentMutation = useCreateCommentMutation(postId, isLoggedIn);
  const deleteCommentMutation = useDeleteCommentMutation(postId, isLoggedIn);
  const updateCommentMutation = useUpdateCommentMutation(postId, isLoggedIn);

  const handleCreateComment = async (content: string) => {
    if (!postId) return;

    try {
      await createCommentMutation.mutateAsync(content);
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      showToast({ type: 'error', message: '댓글 등록에 실패했습니다.' });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      showToast({ type: 'error', message: '댓글 삭제에 실패했습니다.' });
    }
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateCommentMutation.mutateAsync({ commentId, content });
      showToast({ type: 'success', message: '댓글이 수정되었습니다.' });
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      showToast({ type: 'error', message: '댓글 수정에 실패했습니다.' });
    }
  };

  return {
    isCreatingComment: createCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    handleCreateComment,
    handleDeleteComment,
    handleUpdateComment,
  };
};
