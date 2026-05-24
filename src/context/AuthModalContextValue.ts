import { createContext } from 'react';

export interface AuthModalContextType {
  openLogin: () => void;
  closeLogin: () => void;
  openUnregistered: () => void;
  openLogoutConfirm: (onConfirm?: () => void) => void;
}

export const AuthModalContext = createContext<AuthModalContextType | null>(null);
