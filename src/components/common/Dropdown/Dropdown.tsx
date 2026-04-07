import React from 'react';
import type { DropdownProps, DropdownItemProps } from './types';
import { cn } from '@/utils/cn';
import * as styles from './variants';

export const Dropdown = ({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  hasCaret = true,
  isIconOnly = false 
}: DropdownProps & { isIconOnly?: boolean }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-90" onClick={onClose} />
      
      <div className={cn(
        styles.dropdownContainer, 
        isIconOnly ? cn(styles.containerVariants.iconOnly, "flex flex-row items-center") : styles.containerVariants.default,
        hasCaret && (isIconOnly ? styles.caretVariants.iconOnly : styles.caretVariants.default),
        className
      )}>
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
  isIconOnly 
}: DropdownItemProps & { isIconOnly?: boolean }) => (
  <button 
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
          "text-slate-600",
          isIconOnly ? "w-6 h-6" : "w-5 h-5" 
        )} 
      />
    )}
    {!isIconOnly && children}
  </button>
);