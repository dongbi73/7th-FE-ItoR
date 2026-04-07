import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface ModalSubComponentProps {
  children: ReactNode;
}