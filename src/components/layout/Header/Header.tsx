import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { GITLOG, ReorderIcon } from '@/assets/icons';
import { IconButton } from '@/components/common/IconButton';
import { ProfileCard } from '@/components/common/ProfileCard';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useMeQuery } from '@/hooks/queries/useUserQueries';
import { cn } from '@/utils/cn';
import { HeaderActions } from './HeaderActions';
import * as styles from './Header.styles';

interface HeaderProps {
  type?: 'main' | 'plain' | 'detail' | 'edit' | 'profileView' | 'profileEdit';
  onPublish?: () => void;
  onDelete?: () => void;
  preview?: boolean;
  isPublishDisabled?: boolean;
  onCommentClick?: () => void;
  showMoreButton?: boolean;
  isMoreMenuOpen?: boolean;
  onMoreClick?: () => void;
  onMoreMenuClose?: () => void;
  moreMenu?: ReactNode;
}

export const Header = ({
  type = 'main',
  onPublish,
  onDelete,
  preview = false,
  isPublishDisabled = false,
  onCommentClick,
  showMoreButton = false,
  isMoreMenuOpen = false,
  onMoreClick,
  onMoreMenuClose,
  moreMenu,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn } = useAuthStatus();
  const { openLogoutConfirm } = useAuthModal();
  const { data: userData } = useMeQuery({ enabled: isLoggedIn && isProfileOpen });

  const closeProfile = () => setIsProfileOpen(false);

  const handleMenuClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    navigate('/write');
  };

  return (
    <header className={cn(styles.headerBase, !preview && styles.headerFixed)}>
      <div className="flex items-center gap-2">
        <IconButton
          icon={<ReorderIcon />}
          size="frame"
          aria-label="마이페이지"
          onClick={handleMenuClick}
        />
        <h1 className={styles.logoStyle} aria-label="GITLOG">
          <GITLOG className="h-7 w-16.75" aria-hidden="true" />
        </h1>
      </div>

      {isProfileOpen && (
        <div className="border-gray-90 fixed top-0 left-0 z-200 h-screen border-r shadow-sm">
          <ProfileCard
            isLoggedIn={isLoggedIn}
            user={userData}
            onLogout={() => {
              openLogoutConfirm(closeProfile);
            }}
            onMyGitlog={() => {
              closeProfile();
              navigate('/profile/me');
            }}
            onWriteGitlog={() => {
              closeProfile();
              navigate(isLoggedIn ? '/write' : '/login');
            }}
            onSetting={() => {
              closeProfile();
              navigate('/profile/me/settings');
            }}
            onAvatarClick={() => {
              if (!isLoggedIn) return;
              closeProfile();
              navigate('/profile/me');
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <HeaderActions
          type={type}
          onWriteClick={handleWriteClick}
          onPublish={onPublish}
          onDelete={onDelete}
          isPublishDisabled={isPublishDisabled}
          onCommentClick={onCommentClick}
          showMoreButton={showMoreButton}
          isMoreMenuOpen={isMoreMenuOpen}
          onMoreClick={onMoreClick}
          onMoreMenuClose={onMoreMenuClose}
          moreMenu={moreMenu}
        />
      </div>
    </header>
  );
};
