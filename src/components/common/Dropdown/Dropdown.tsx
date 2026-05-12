import React, { useEffect } from 'react';
import type { DropdownProps, DropdownItemProps } from './types';
import { cn } from '@/utils/cn';
import * as styles from './variants';

export const Dropdown = ({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  hasCaret = true,
  isIconOnly = false, 
  position = 'bottom'
}: DropdownProps & { isIconOnly?: boolean }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const caretStyle = isIconOnly 
    ? styles.caretVariants[position].iconOnly 
    : styles.caretVariants[position].default;
  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-90" onClick={onClose} />
      
      <div
        role="menu"
        className={cn(
          styles.dropdownContainer, 
          styles.positionVariants[position],
          isIconOnly ? styles.containerVariants.iconOnly : styles.containerVariants.default,
          hasCaret && caretStyle,
          className
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { isIconOnly });
          }
          return child;
        })}
      </div>
    </>
  );
};

Dropdown.Item = ({ 
  children, 
  onClick, 
  className, 
  icon: Icon,
  isIconOnly, 
  asChild
}: DropdownItemProps & { isIconOnly?: boolean }) => {
  
  if (asChild && React.isValidElement(children)) {
    return (
      <div className={cn("flex items-center justify-center", className)} onClick={onClick}>
        {children}
      </div>
    );
  }
  return (
  <button 
    type="button"
    role="menuitem"
    className={cn(
      styles.itemBase, 
      isIconOnly ? styles.itemVariants.iconOnly : styles.itemVariants.default,
      className
    )} 
    onClick={onClick}
  >
    {Icon && (
      <Icon 
        className={cn(
          "text-gray-33",
          isIconOnly ? "w-6 h-6" : "w-5 h-5" 
        )} 
      />
    )}
    {!isIconOnly && children}
  </button>

  );
};
