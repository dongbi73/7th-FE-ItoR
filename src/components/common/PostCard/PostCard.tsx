import { cn } from '@/utils/cn';
import * as styles from './variants';
import { PostMeta } from '@/components/common/PostMeta';
import type { Post } from '@/api/post';
import { getFormattedDate } from '@/utils/date'; 
import type { KeyboardEvent } from 'react';


interface PostCardProps {
  post: Post;
  className?: string;
  onClick?: () => void;
}

export const PostCard = ({ post, className, onClick }: PostCardProps) => {
  const textContent = post.contents.find(c => c.contentType === 'TEXT')?.content ?? '';
  const imageContent = post.contents.find(c => c.contentType === 'IMAGE')?.content;
  const formattedDate = getFormattedDate(post.createdAt);
  const isInteractive = !!onClick;
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
<article
  className={cn(styles.postCardBase, isInteractive && 'cursor-pointer', className)}
  onClick={onClick}
  onKeyDown={handleKeyDown}
  role={isInteractive ? 'button' : undefined}
  tabIndex={isInteractive ? 0 : undefined}
  aria-label={isInteractive ? `${post.title} 게시글 보기` : undefined}
>
    <div className="flex flex-col">

    
      <div className={styles.postCardContentGroup}>
        <h2 className={styles.postCardTitle}>{post.title}</h2>
        <p className={styles.postCardPreview}>{textContent}</p>
      </div>

        <PostMeta 
          profileUrl={post.profileUrl}
          nickName={post.nickName}
          formattedDate={formattedDate}
          commentCount={post.commentCount}
        />
    </div>  

      {imageContent && (
        <div className={styles.postCardThumbnailContainer}>
          <img 
            src={imageContent} 
            alt={post.title} 
            loading="lazy"
            decoding="async"
            className={styles.postCardThumbnail} 
          />
        </div>
      )}
    </article>
  );
};
