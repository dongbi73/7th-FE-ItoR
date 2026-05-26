import type { ReactNode } from 'react';

export type HeaderType = 'main' | 'plain' | 'detail' | 'edit' | 'profileView' | 'profileEdit';

export interface HeaderActionsProps {
  type: HeaderType;
  onWriteClick: () => void;
  onPublish?: () => void;
  onDelete?: () => void;
  isPublishDisabled?: boolean;
  onCommentClick?: () => void;
  showMoreButton?: boolean;
  isMoreMenuOpen?: boolean;
  onMoreClick?: () => void;
  onMoreMenuClose?: () => void;
  moreMenu?: ReactNode;
}
