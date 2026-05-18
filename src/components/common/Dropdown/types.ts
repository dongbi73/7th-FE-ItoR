import type { ReactNode, ElementType, MouseEvent } from 'react';

export interface DropdownProps {
  isOpen: boolean;          
  onClose: () => void;      
  children: ReactNode;      
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;       
  hasCaret?: boolean;       
  isIconOnly?: boolean;
  position?: 'top' | 'bottom';
}

export interface DropdownItemProps {
  children?: ReactNode;      
  onClick?: (e: MouseEvent<HTMLElement>) => void; 
  className?: string;       
  icon?: ElementType;       
  asChild?: boolean;
}
