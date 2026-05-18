import { useState } from 'react';
import { PostMeta } from '@/components/common/PostMeta';
import { Dropdown } from '@/components/common/Dropdown';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { getFormattedDate } from '@/utils/date';
import type { Comment } from '@/api/post';
import { Blank } from '../common/Blank';

interface CommentItemProps {
  comment: Comment;
  isLoggedIn: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  onDelete: (commentId: number) => Promise<void> | void;
  onUpdate: (commentId: number, content: string) => Promise<void> | void;
}

export const CommentItem = ({
  comment,
  isLoggedIn,
  isDeleting = false,
  isUpdating = false,
  onDelete,
  onUpdate,
}: CommentItemProps) => {
  const formattedDate = getFormattedDate(comment.createdAt);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const canManageComment = isLoggedIn && comment.isOwner;

  const handleEditClick = () => {
    setEditText(comment.content);
    setIsDropdownOpen(false);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const content = editText.trim();

    if (!content || isUpdating) return;

    await onUpdate(comment.commentId, content);
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    await onDelete(comment.commentId);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full max-w-172">
      <div className="relative">
          <PostMeta
            variant="comment"
            profileUrl={comment.profileUrl}
            nickName={comment.nickName}
            formattedDate={formattedDate}
            showMoreButton={canManageComment}
            isMoreMenuOpen={isDropdownOpen}
            moreMenuId={`comment-menu-${comment.commentId}`}
            moreButtonId={`comment-menu-button-${comment.commentId}`}
            onMoreClick={() => setIsDropdownOpen((prev) => !prev)}
          />

        <Dropdown
          id={`comment-menu-${comment.commentId}`}
          ariaLabelledBy={`comment-menu-button-${comment.commentId}`}
          isOpen={canManageComment && isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          className="top-13 right-4 left-auto translate-x-0"
        >
          <Dropdown.Item onClick={handleEditClick}>수정하기</Dropdown.Item>
          <Dropdown.Item onClick={handleDeleteClick} className="text-negative">
            삭제하기
          </Dropdown.Item>
        </Dropdown>
      </div>

      <div className="pl-6.5">
        {isEditing ? (
          <div className="px-4 py-3">
            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              aria-label="댓글 수정"
              disabled={isUpdating}
              className="border-gray-90 text-gray-20 min-h-22.5 w-full resize-none rounded-sm border px-4 py-3 text-[14px] leading-relaxed font-light outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-primary"
            />
            <div className="mt-2 flex flex-wrap justify-end gap-2">
              <Button
                variant="grayOutline"
                className="h-8 rounded-[25px] px-3 text-[13px]"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                취소
              </Button>
              <Button
                variant={editText.trim() ? 'blackFilled' : 'grayOutline'}
                className="h-8 rounded-[25px] px-3 text-[13px]"
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                {isUpdating ? '저장 중' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-20 wrap-break-word px-4 py-3 text-[14px] leading-relaxed font-light">
            {comment.content}
          </p>
        )}
      </div>
      <Blank size="sm" />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        ariaLabelledBy={`comment-delete-title-${comment.commentId}`}
      >
        <Modal.Header>
          <Modal.Title>
            <span id={`comment-delete-title-${comment.commentId}`}>댓글을 삭제할까요?</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer
          secondaryText="취소"
          onSecondaryClick={() => setIsDeleteModalOpen(false)}
          primaryText="삭제하기"
          onPrimaryClick={handleConfirmDelete}
          primaryClassName="bg-negative"
          primaryDisabled={isDeleting}
          secondaryDisabled={isDeleting}
        />
      </Modal>
    </div>
  );
};
