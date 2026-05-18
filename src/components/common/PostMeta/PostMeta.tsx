import { Avatar } from '@/components/common/Avatar';
import { IconButton } from '@/components/common/IconButton';
import { MoreVertIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';
import * as styles from './variants';

interface PostMetaProps {
  variant?: 'default' | 'simple' | 'comment';
  profileUrl?: string;
  nickName: string;
  formattedDate?: string;
  commentCount?: number;
  className?: string;
  showMoreButton?: boolean;
  isMoreMenuOpen?: boolean;
  moreMenuId?: string;
  moreButtonId?: string;
  onMoreClick?: () => void;
}

export const PostMeta = ({
  variant = 'default',
  profileUrl,
  nickName,
  formattedDate,
  commentCount,
  className,
  showMoreButton = false,
  isMoreMenuOpen = false,
  moreMenuId,
  moreButtonId,
  onMoreClick,
}: PostMetaProps) => {
  if (variant === 'simple') {
    return (
      <div className={cn(styles.postMetaContainer, className)}>
        <div className={styles.postMetaUserGroup}>
          <Avatar size={20} src={profileUrl} fallback={nickName?.[0]} />
          <span className={styles.postMetaNickname}>{nickName}</span>
        </div>
      </div>
    );
  }
  if (variant === 'comment') {
    return (
      <div className={cn(styles.postMetaContainer, 'w-full justify-between', className)}>
        <div className={styles.postMetaUserGroup}>
          <Avatar size={20} src={profileUrl} fallback={nickName?.[0]} />
          <div className="flex flex-col">
            <span className={styles.postMetaNickname}>{nickName}</span>
            <span className={styles.postMetaDate}>{formattedDate}</span>
          </div>
        </div>

        {showMoreButton && (
          <IconButton
            icon={<MoreVertIcon />}
            size="frame"
            className="text-gray-20"
            aria-label="댓글 메뉴"
            aria-haspopup="menu"
            aria-expanded={isMoreMenuOpen}
            aria-controls={moreMenuId}
            id={moreButtonId}
            onClick={onMoreClick}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn(styles.postMetaContainer, className)}>
      <div className={styles.postMetaUserGroup}>
        <Avatar size={20} src={profileUrl} fallback={nickName?.[0]?.toUpperCase()} />
        <span className={styles.postMetaNickname}>{nickName}</span>
      </div>

      <span className={styles.postMetaDivider}>·</span>
      <span className={styles.postMetaDate}>{formattedDate}</span>

      <span className={styles.postMetaDivider}>·</span>
      <span className={styles.postMetaDate}>댓글 {commentCount}</span>
    </div>
  );
};
