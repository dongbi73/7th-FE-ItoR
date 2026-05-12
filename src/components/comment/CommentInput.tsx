import { type RefObject, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import { PostMeta } from '@/components/common/PostMeta';

interface CommentInputProps {
  isLoggedIn?: boolean;
  nickName?: string;
  profileUrl?: string;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onSubmit?: (content: string) => Promise<void> | void;
}

export const CommentInput = ({
  isLoggedIn = false,
  nickName = '',
  profileUrl = '',
  textareaRef,
  onSubmit,
}: CommentInputProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async () => {
    const content = commentText.trim();

    if (!content) {
      setCommentText('');
      textareaRef?.current?.focus();
      return;
    }

    await onSubmit?.(content);
    setCommentText('');
    textareaRef?.current?.focus();
  };

  if (!isLoggedIn) {
    return (
      <div className="border-gray-90 overflow-hidden rounded-sm border bg-white py-2">
        <textarea
          placeholder="로그인을 하고 댓글을 작성해보세요"
          aria-label="댓글 입력"
          disabled
          className="min-h-22.5 w-full cursor-not-allowed resize-none px-4 py-3 text-[14px] leading-snug font-light outline-none placeholder:text-gray-78"
        />
      </div>
    );
  }

  return (
    <div className="border-gray-90 flex flex-col rounded-sm border bg-white py-2">
      <PostMeta variant="simple" profileUrl={profileUrl} nickName={nickName} />

      <textarea
        ref={textareaRef}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="댓글을 입력하세요"
        aria-label="댓글 입력"
        className="text-gray-20 h-28 w-full resize-none px-4 py-3 text-[14px] leading-snug font-light outline-none placeholder:text-gray-56 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-btn-primary"
      />

      <Divider className="mx-auto" />

      <div className="flex justify-end px-4 py-2">
        <Button
          variant={commentText.trim() ? 'blackFilled' : 'grayOutline'}
          className="h-9.5 w-16 rounded-[25px] px-3 py-2 text-[14px]"
          onClick={handleSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  );
};
