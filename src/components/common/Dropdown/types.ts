import type { ReactNode, ElementType, MouseEvent } from 'react';

export interface DropdownProps {
  isOpen: boolean;          
  onClose: () => void;      
  children: ReactNode;      
  className?: string;       
  hasCaret?: boolean;       
  isIconOnly?: boolean;
}

export interface DropdownItemProps {
  children?: ReactNode;      
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void; 
  className?: string;       
  icon?: ElementType;       
}