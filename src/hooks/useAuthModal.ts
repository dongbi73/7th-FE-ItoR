import { useContext } from 'react';
import { AuthModalContext } from '@/context/AuthModalContextValue';

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
};
