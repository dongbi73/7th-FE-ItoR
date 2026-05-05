import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export interface ModalSubComponentProps {
  children: ReactNode;
}

export interface ModalFooterProps {
  primaryText: string;              
  onPrimaryClick: () => void;       
  secondaryText?: string;           
  onSecondaryClick?: () => void;    
  primaryClassName?: string;

}