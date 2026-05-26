import { cn } from '@/utils/cn';
import * as styles from './variants';
import { PostMeta } from '@/components/common/PostMeta';
import type { Post } from '@/api/post';
import { getFormattedDate } from '@/utils/date';
import { sortByContentOrder } from '@/utils/postContent';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  className?: string;
  to?: string;
}

export const PostCard = ({ post, className, to }: PostCardProps) => {
  const orderedContents = sortByContentOrder(post.contents);
  const textContent =
    orderedContents.find((content) => content.contentType === 'TEXT')?.content ?? '';
  const imageContent = orderedContents.find((content) => content.contentType === 'IMAGE')?.content;
  const formattedDate = getFormattedDate(post.createdAt);
  const content = (
    <>
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
            alt={`${post.title} 썸네일`}
            width="124"
            height="116"
            loading="lazy"
            decoding="async"
            className={styles.postCardThumbnail}
          />
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <article>
        <Link
          to={to}
          className={cn(styles.postCardBase, 'cursor-pointer', className)}
          aria-label={`${post.title} 게시글 보기`}
        >
          {content}
        </Link>
      </article>
    );
  }

  return (
    <article className={cn(styles.postCardBase, className)}>
      {content}
    </article>
  );
};
