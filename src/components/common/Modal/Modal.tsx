import type { ModalProps, ModalSubComponentProps } from './types';
import * as styles from './variants';

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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

Modal.Footer = ({ children }: ModalSubComponentProps) => (
  <div className={styles.modalFooterBase}>{children}</div>
);