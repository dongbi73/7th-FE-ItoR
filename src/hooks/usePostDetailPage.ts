import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/api/post';
import {
  postKeys,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  usePostDetailQuery,
  useUpdateCommentMutation,
} from '@/hooks/queries/usePosts';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useToast } from '@/hooks/useToast';
import { getFormattedDate } from '@/utils/date';
import { sortByContentOrder } from '@/utils/postContent';

const HEADER_OFFSET = 72;

export const usePostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const commentRef = useRef<HTMLElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { authUser, isLoggedIn } = useAuthStatus();
  const { data: post, isLoading, isError } = usePostDetailQuery({ postId, isLoggedIn });
  const createCommentMutation = useCreateCommentMutation(postId, isLoggedIn);
  const deleteCommentMutation = useDeleteCommentMutation(postId, isLoggedIn);
  const updateCommentMutation = useUpdateCommentMutation(postId, isLoggedIn);

  const scrollToComment = () => {
    if (!commentRef.current) return;

    const top =
      commentRef.current.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 10;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleCommentIconClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    scrollToComment();
    window.setTimeout(() => commentInputRef.current?.focus(), 350);
  };

  const handleEditPost = () => {
    if (!postId || !post) return;

    sessionStorage.setItem(`post-preview:${postId}`, JSON.stringify(post));
    setIsPostMenuOpen(false);
    navigate(`/write/${postId}`);
  };

  const handleDeletePostClick = () => {
    setIsPostMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

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

  const state = {
    post,
    isLoading,
    isError,
    isLoggedIn,
    isPostMenuOpen,
    isDeleteModalOpen,
    isDeletingPost,
    formattedDate: post ? getFormattedDate(post.createdAt) : '',
    commentWriterNickName: authUser?.nickname ?? '',
    commentWriterProfileUrl: authUser?.profilePicture ?? '',
    authorFallback: post?.nickName[0]?.toUpperCase() ?? 'G',
    canManagePost: !!post && isLoggedIn && post.isOwner,
    orderedContents: post ? sortByContentOrder(post.contents) : [],
    isCreatingComment: createCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
  };

  return {
    state,
    refs: {
      commentRef,
      commentInputRef,
    },
    actions: {
      setIsPostMenuOpen,
      setIsDeleteModalOpen,
      handleCommentIconClick,
      handleEditPost,
      handleDeletePostClick,
      handleDeletePost,
      handleCreateComment,
      handleDeleteComment,
      handleUpdateComment,
    },
  };
};
