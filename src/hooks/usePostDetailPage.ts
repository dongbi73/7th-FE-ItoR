import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostDetailQuery } from '@/hooks/queries/usePosts';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useCommentActions } from '@/hooks/useCommentActions';
import { useCommentFocus } from '@/hooks/useCommentFocus';
import { usePostDelete } from '@/hooks/usePostDelete';
import { getFormattedDate } from '@/utils/date';
import { sortByContentOrder } from '@/utils/postContent';

export const usePostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const { authUser, isLoggedIn } = useAuthStatus();
  const { data: post, isLoading, isError } = usePostDetailQuery({ postId, isLoggedIn });
  const { commentRef, commentInputRef, handleCommentIconClick } = useCommentFocus(isLoggedIn);
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeletingPost,
    handleDeletePost,
  } = usePostDelete(postId);
  const {
    isCreatingComment,
    isDeletingComment,
    isUpdatingComment,
    handleCreateComment,
    handleDeleteComment,
    handleUpdateComment,
  } = useCommentActions(postId, isLoggedIn);

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
    isCreatingComment,
    isDeletingComment,
    isUpdatingComment,
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
