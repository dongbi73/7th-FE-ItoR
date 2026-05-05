import { useEffect } from 'react';
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
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
}: ModalFooterProps) => (
  <div className={styles.modalFooterBase}>
    {secondaryText && (
      <Button 
        variant="primaryOutline" 
        className="flex-1 w-full px-3 py-2 rounded-xs border-gray-96 text-black " 
        onClick={onSecondaryClick}
      >
        {secondaryText}
      </Button>
    )}

    <Button 
      variant="primaryOutline" 
      className={cn('flex-1 w-full px-3 py-2 rounded-xs bg-btn-primary text-white',
      primaryClassName,)}  
      onClick={onPrimaryClick}
    >
      {primaryText}
    </Button>
  </div>
);
