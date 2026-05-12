import * as styles from './Header.styles';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatIcon, CreateIcon, MoreVertIcon, ReorderIcon } from '@/assets/icons';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { IconButton } from '@/components/common/IconButton';
import { ProfileCard } from '@/components/common/ProfileCard';
import { cn } from '@/utils/cn';
import { useAuthModal } from '@/context/AuthModalContext';
import { useMeQuery } from '@/hooks/queries/useUserQueries';

interface HeaderProps {
  type?: 'main' | 'plain' | 'detail' | 'edit' | 'profileView' | 'profileEdit';
  onPublish?: () => void;
  onDelete?: () => void;
  preview?: boolean;
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
  onCommentClick,
  showMoreButton = false,
  isMoreMenuOpen = false,
  onMoreClick,
  onMoreMenuClose,
  moreMenu,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('accessToken');
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
        <h1 className={styles.logoStyle}>GITLOG</h1>
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
        {type === 'main' && (
          <Button
            variant="ghost"
            icon={<CreateIcon className="h-full w-full" />}
            iconClassName="w-6 h-6"
            onClick={handleWriteClick}
            className="h-auto gap-1 px-3 py-2 text-[14px]"
          >
            깃로그 쓰기
          </Button>
        )}

        {type === 'detail' && (
          <>
            <div className="flex gap-2">
              <IconButton
                icon={<ChatIcon />}
                size="frame"
                aria-label="댓글 보기"
                onClick={onCommentClick}
              />
              {showMoreButton && (
                <div className="relative">
                  <IconButton
                    icon={<MoreVertIcon />}
                    size="frame"
                    aria-label="더보기"
                    onClick={onMoreClick}
                  />
                  {moreMenu && (
                    <Dropdown
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
          </>
        )}

        {type === 'edit' && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onDelete}
              className="text-negative px-3 py-2 text-[14px] font-medium"
            >
              삭제하기
            </button>
            <button
              type="button"
              onClick={onPublish}
              className="px-3 py-2 text-[14px] font-medium text-black"
            >
              게시하기
            </button>
          </div>
        )}

        {type === 'profileView' && (
          <button
            type="button"
            onClick={onPublish}
            className="px-3 py-2 text-[14px] font-medium text-black"
          >
            수정하기
          </button>
        )}

        {type === 'profileEdit' && (
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onDelete}
              className="text-negative px-3 py-2 text-[14px] font-medium"
            >
              취소하기
            </button>
            <button
              type="button"
              onClick={onPublish}
              className="w-19 px-3 py-2 text-[14px] font-medium text-black"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
