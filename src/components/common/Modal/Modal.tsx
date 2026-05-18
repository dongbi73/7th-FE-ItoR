import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import type { ModalProps, ModalSubComponentProps, ModalFooterProps } from './types';
import { Button } from '@/components/common/Button'; 
import * as styles from './variants';

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps & { className?: string }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusFirstElement = () => {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      const firstFocusableElement = focusableElements?.[0] ?? dialogRef.current;

      firstFocusableElement?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.setTimeout(focusFirstElement, 0);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={`${styles.modalContent} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }: ModalSubComponentProps) => (
  <div className={styles.modalHeaderBase}>{children}</div>
);

Modal.Title = ({ children }: ModalSubComponentProps) => (
  <h2 className={styles.modalTitleBase}>{children}</h2>
);

Modal.Description = ({ children }: ModalSubComponentProps) => (
  <p className={styles.modalDescriptionBase}>{children}</p>
);

Modal.Footer = ({ 
  primaryText, 
  onPrimaryClick, 
  secondaryText, 
  onSecondaryClick,
  primaryClassName, 
  primaryDisabled = false,
  secondaryDisabled = false,
}: ModalFooterProps) => (
  <div className={styles.modalFooterBase}>
    {secondaryText && (
      <Button 
        variant="primaryOutline" 
        className="flex-1 w-full px-3 py-2 rounded-xs border-gray-96 text-black " 
        onClick={onSecondaryClick}
        disabled={secondaryDisabled}
      >
        {secondaryText}
      </Button>
    )}

    <Button 
      variant="primaryOutline" 
      className={cn('flex-1 w-full px-3 py-2 rounded-xs bg-btn-primary text-white',
      primaryClassName,)}  
      onClick={onPrimaryClick}
      disabled={primaryDisabled}
    >
      {primaryText}
    </Button>
  </div>
);
