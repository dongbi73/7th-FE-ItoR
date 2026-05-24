import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/common/Avatar';
import { Blank } from '@/components/common/Blank';
import { Dropdown } from '@/components/common/Dropdown';
import { Modal } from '@/components/common/Modal';
import { PostMeta } from '@/components/common/PostMeta';
import { StatusMessage } from '@/components/common/StatusMessage';
import { CommentInput } from '@/components/comment/CommentInput';
import { CommentItem } from '@/components/comment/CommentItem';
import { usePostDetailPage } from '@/hooks/usePostDetailPage';

const PostDetailPage = () => {
  const {
    state: {
      post,
      isLoading,
      isError,
      isLoggedIn,
      isPostMenuOpen,
      isDeleteModalOpen,
      isDeletingPost,
      formattedDate,
      commentWriterNickName,
      commentWriterProfileUrl,
      authorFallback,
      canManagePost,
      orderedContents,
      isCreatingComment,
      isDeletingComment,
      isUpdatingComment,
    },
    refs: { commentRef, commentInputRef },
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
  } = usePostDetailPage();

  if (isLoading) {
    return (
      <>
        <Header type="detail" onCommentClick={handleCommentIconClick} />
        <main className="mx-auto max-w-172">
          <StatusMessage className="py-16">게시글을 불러오고 있습니다.</StatusMessage>
        </main>
      </>
    );
  }

  if (isError || !post) {
    return (
      <>
        <Header type="detail" onCommentClick={handleCommentIconClick} />
        <main className="mx-auto max-w-172">
          <StatusMessage className="py-16">게시글을 불러오지 못했습니다.</StatusMessage>
        </main>
      </>
    );
  }

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
                  isDeleting={isDeletingComment}
                  isUpdating={isUpdatingComment}
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
              isSubmitting={isCreatingComment}
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
            <span id="post-delete-description">삭제한 블로그는 다시 확인할 수 없어요.</span>
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
