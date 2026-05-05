import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthPopup } from '@/pages/auth/AuthPopup';
import { Modal } from '@/components/common/Modal';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthModalContextType {
  openLogin: () => void;
  closeLogin: () => void;
  openUnregistered: () => void;
  openLogoutConfirm: (onConfirm?: () => void) => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUnregisteredOpen, setIsUnregisteredOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutConfirmCallback, setLogoutConfirmCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginOpen(true);
    }
  }, [location.pathname]);

  const openLogin = () => navigate('/login');

  const closeLogin = () => {
    setIsLoginOpen(false);
    navigate('/');
  };

  const openUnregistered = () => {
    setIsLoginOpen(false);
    setIsUnregisteredOpen(true);
  };

  const openLogoutConfirm = (onConfirm?: () => void) => {
    setLogoutConfirmCallback(() => onConfirm ?? null);
    setIsLogoutOpen(true);
  };

  const closeLogoutConfirm = () => {
    setIsLogoutOpen(false);
    setLogoutConfirmCallback(null);
  };

  return (
    <AuthModalContext.Provider
      value={{ openLogin, closeLogin, openUnregistered, openLogoutConfirm }}
    >
      {children}

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-modal-overlay/30 backdrop-blur-xs">
          <AuthPopup onClose={closeLogin} onUnregistered={openUnregistered} />
        </div>
      )}

      <Modal isOpen={isUnregisteredOpen} onClose={() => setIsUnregisteredOpen(false)}>
        <Modal.Header>
          <Modal.Title> 가입되지 않은 계정이에요. </Modal.Title>
          <Modal.Description>회원가입을 진행할까요?</Modal.Description>
        </Modal.Header>

        <Modal.Footer
          secondaryText="취소"
          onSecondaryClick={() => {
            setIsUnregisteredOpen(false);
          }}
          primaryText="회원가입하기"
          onPrimaryClick={() => {
            setIsUnregisteredOpen(false);
            navigate('/register');
          }}
        />
      </Modal>

      <Modal isOpen={isLogoutOpen} onClose={closeLogoutConfirm}>
        <Modal.Header>
          <Modal.Title>로그아웃을 진행할게요</Modal.Title>
        </Modal.Header>

        <Modal.Footer
          secondaryText="취소"
          onSecondaryClick={closeLogoutConfirm}
          primaryText="로그아웃"
          onPrimaryClick={() => {
            logout();
            logoutConfirmCallback?.();
            closeLogoutConfirm();
            navigate('/');
          }}
        />
      </Modal>
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
};
