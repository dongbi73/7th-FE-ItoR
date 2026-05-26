import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HEADER_OFFSET = 72;

export const useCommentFocus = (isLoggedIn: boolean) => {
  const navigate = useNavigate();
  const commentRef = useRef<HTMLElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

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

  return {
    commentRef,
    commentInputRef,
    handleCommentIconClick,
  };
};
