import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/common/Avatar';
import { Blank } from '@/components/common/Blank';
import { Dropdown } from '@/components/common/Dropdown';
import { Modal } from '@/components/common/Modal';
import { PostMeta } from '@/components/common/PostMeta';
import { CommentInput } from '@/components/comment/CommentInput';
import { CommentItem } from '@/components/comment/CommentItem';
import { getFormattedDate } from '@/utils/date';
import { sortByContentOrder } from '@/utils/postContent';
import { useAuthStore } from '@/store/useAuthStore';
import { deletePost } from '@/api/post';
import { useToast } from '@/hooks/useToast';
import {
  postKeys,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  usePostDetailQuery,
  useUpdateCommentMutation,
} from '@/hooks/queries/usePosts';

const HEADER_OFFSET = 72;

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const commentRef = useRef<HTMLElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();
  const authUser = useAuthStore((state) => state.user);
  const isLoggedIn =
    useAuthStore((state) => state.isLoggedIn) || !!localStorage.getItem('accessToken');
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

  if (isLoading) {
    return (
      <>
        <Header type="detail" onCommentClick={handleCommentIconClick} />
        <main className="mx-auto max-w-172 px-4 py-16 text-center text-[14px] text-gray-56">
          게시글을 불러오고 있습니다.
        </main>
      </>
    );
  }

  if (isError || !post) {
    return (
      <>
        <Header type="detail" onCommentClick={handleCommentIconClick} />
        <main className="mx-auto max-w-172 px-4 py-16 text-center text-[14px] text-gray-56">
          게시글을 불러오지 못했습니다.
        </main>
      </>
    );
  }

  const formattedDate = getFormattedDate(post.createdAt);
  const commentWriterNickName = authUser?.nickname ?? '나';
  const commentWriterProfileUrl = authUser?.profilePicture ?? '';
  const authorFallback = post.nickName[0]?.toUpperCase() ?? 'G';
  const canManagePost = isLoggedIn && post.isOwner;
  const orderedContents = sortByContentOrder(post.contents);

  return (
    <>
      <Header
        type="detail"
        onCommentClick={handleCommentIconClick}
        showMoreButton={canManagePost}
        isMoreMenuOpen={isPostMenuOpen}
        onMoreClick={() => setIsPostMenuOpen((prev) => !prev)}
        onMoreMenuClose={() => setIsPostMenuOpen(false)}
        moreMenu={
          <>
            <Dropdown.Item onClick={handleEditPost}>수정하기</Dropdown.Item>
            <Dropdown.Item onClick={handleDeletePostClick} className="text-negative">
              삭제하기
            </Dropdown.Item>
          </>
        }
      />
      <div className="flex flex-col items-center justify-center">
        <Blank size="lg" />

        <section className="w-full max-w-172 py-3">
          <div className="flex flex-col gap-3 px-4 py-3">
            <h1 className="text-[32px] leading-tight font-medium">{post.title}</h1>
            <p className="text-gray-20 text-[14px] font-light">{post.introduction}</p>
          </div>
          <Blank size="md" />
          <PostMeta
            profileUrl={post.profileUrl}
            nickName={post.nickName}
            formattedDate={formattedDate}
            commentCount={post.comments.length}
          />
        </section>
      </div>

      <hr className="w-full border-0 border-t border-divider" />

      <main className="mx-auto w-full max-w-172">
        <Blank size="md" />

        <section>
          {orderedContents.map((content) => {
            const wrapperClass = 'py-[12px] px-[16px] w-full';

            if (content.contentType === 'TEXT') {
              return (
                <div key={content.contentOrder} className={wrapperClass}>
                  <p className="text-gray-20 text-[14px] leading-[1.8] font-light break-all">
                    {content.content}
                  </p>
                </div>
              );
            }

            if (content.contentType === 'IMAGE') {
              return (
                <div key={content.contentOrder} className={wrapperClass}>
                  <img
                    src={content.content}
                    alt={`${post.title} 본문 이미지 ${content.contentOrder}`}
                    width="688"
                    height="387"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              );
            }
            return null;
          })}
        </section>

        <Blank size="md" />

        <section ref={commentRef} className="mx-auto w-full max-w-172" aria-label="댓글">
          <h3 className="gap-10 px-4 pt-4 pb-3 text-[16px] font-medium">
            댓글 <span className="text-btn-primary">{post.comments.length}</span>
          </h3>

          <Blank size="sm" />

          <div className="flex flex-col gap-2.5">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  isLoggedIn={isLoggedIn}
                  isDeleting={deleteCommentMutation.isPending}
                  isUpdating={updateCommentMutation.isPending}
                  onDelete={handleDeleteComment}
                  onUpdate={handleUpdateComment}
                />
              ))
            ) : (
              <div className="px-4 py-3 text-center font-light">
                <p className="text-gray-78 text-[14px]">작성된 댓글이 없습니다.</p>
                <p className="text-gray-78 text-[14px]">회원님이 첫 번째 댓글을 남겨주세요.</p>
              </div>
            )}
          </div>

          <Blank size="sm" />

          <div className="px-4 py-3">
            <CommentInput
              isLoggedIn={isLoggedIn}
              nickName={commentWriterNickName}
              profileUrl={commentWriterProfileUrl}
              textareaRef={commentInputRef}
              isSubmitting={createCommentMutation.isPending}
              onSubmit={handleCreateComment}
            />
          </div>

          <Blank size="lg" />
        </section>
      </main>

      <section className="bg-gray-96 flex h-88.5 w-full justify-center">
        <div className="flex w-full max-w-172 flex-col">
          <Blank size="lg" />

          <div className="px-4 py-3">
            <Avatar size={64} src={post.profileUrl} fallback={authorFallback} />
          </div>

          <div className="flex flex-col items-start gap-3 px-4 py-3">
            <h3 className="wrap-break-word text-[32px] font-medium">{post.nickName}</h3>
            <p className="text-gray-20 text-[14px] font-light">{post.introduction}</p>
          </div>
          <Blank size="lg" />
        </div>
      </section>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        ariaLabelledBy="post-delete-title"
        ariaDescribedBy="post-delete-description"
      >
        <Modal.Header>
          <Modal.Title>
            <span id="post-delete-title">해당 블로그를 삭제하시겠어요?</span>
          </Modal.Title>
          <Modal.Description>
            <span id="post-delete-description">삭제된 블로그는 다시 확인할 수 없어요</span>
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer
          secondaryText="취소"
          onSecondaryClick={() => setIsDeleteModalOpen(false)}
          primaryText="삭제하기"
          onPrimaryClick={handleDeletePost}
          primaryClassName="bg-negative border border-negative"
          primaryDisabled={isDeletingPost}
          secondaryDisabled={isDeletingPost}
        />
      </Modal>
    </>
  );
};

export default PostDetailPage;
