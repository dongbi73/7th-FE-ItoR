import React, { useEffect, useRef } from 'react';
import type { DropdownProps, DropdownItemProps } from './types';
import { cn } from '@/utils/cn';
import * as styles from './variants';

type DropdownChildProps = {
  isIconOnly?: boolean;
};

type DropdownAsChildProps = {
  role?: string;
  className?: string;
  onClick?: DropdownItemProps['onClick'];
};

export const Dropdown = ({ 
  isOpen, 
  onClose, 
  children, 
  id,
  ariaLabel,
  ariaLabelledBy,
  className, 
  hasCaret = true,
  isIconOnly = false, 
  position = 'bottom'
}: DropdownProps & { isIconOnly?: boolean }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const getMenuItems = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

    window.setTimeout(() => getMenuItems()[0]?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      const menuItems = getMenuItems();
      const currentIndex = menuItems.findIndex((item) => item === document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        menuItems[(currentIndex + 1) % menuItems.length]?.focus();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length]?.focus();
      }

      if (event.key === 'Home') {
        event.preventDefault();
        menuItems[0]?.focus();
      }

      if (event.key === 'End') {
        event.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const caretStyle = isIconOnly 
    ? styles.caretVariants[position].iconOnly 
    : styles.caretVariants[position].default;
  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-90" onClick={onClose} />
      
      <div
        ref={menuRef}
        id={id}
        role="menu"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
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
            return React.cloneElement(child as React.ReactElement<DropdownChildProps>, {
              isIconOnly,
            });
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
    const child = children as React.ReactElement<DropdownAsChildProps>;

    return React.cloneElement(child, {
      role: 'menuitem',
      className: cn(child.props.className, className),
      onClick,
    });
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
