import { ChatIcon, MoreVertIcon } from '@/assets/icons';
import { Dropdown } from '@/components/common/Dropdown';
import { IconButton } from '@/components/common/IconButton';
import type { HeaderActionsProps } from './HeaderActions.types';

type DetailHeaderActionsProps = Pick<
  HeaderActionsProps,
  | 'onCommentClick'
  | 'showMoreButton'
  | 'isMoreMenuOpen'
  | 'onMoreClick'
  | 'onMoreMenuClose'
  | 'moreMenu'
>;

export const DetailHeaderActions = ({
  onCommentClick,
  showMoreButton = false,
  isMoreMenuOpen = false,
  onMoreClick,
  onMoreMenuClose,
  moreMenu,
}: DetailHeaderActionsProps) => (
  <div className="flex gap-2">
    <IconButton icon={<ChatIcon />} size="frame" aria-label="댓글 보기" onClick={onCommentClick} />
    {showMoreButton && (
      <div className="relative">
        <IconButton
          id="post-more-menu-button"
          icon={<MoreVertIcon />}
          size="frame"
          aria-label="더보기"
          aria-haspopup="menu"
          aria-expanded={isMoreMenuOpen}
          aria-controls="post-more-menu"
          onClick={onMoreClick}
        />
        {moreMenu && (
          <Dropdown
            id="post-more-menu"
            ariaLabelledBy="post-more-menu-button"
            isOpen={isMoreMenuOpen}
            onClose={onMoreMenuClose ?? (() => {})}
            position="bottom"
            className="right-0 left-auto translate-x-0"
            hasCaret
          >
            {moreMenu}
          </Dropdown>
        )}
      </div>
    )}
  </div>
);
