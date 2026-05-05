import { useEffect } from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';
import { ErrorOutlineIcon, DoneIcon } from '@/assets/icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'error' ? ErrorOutlineIcon : DoneIcon;
  const role = type === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={cn(styles.toastBase, styles.toastVariants[type])}
    >
      <div className="shrink-0 flex items-center justify-center w-5 h-5">
        {typeof Icon === 'string' ? (
          <img src={Icon} alt="" aria-hidden="true" className="w-full h-full object-contain" />
        ) : (
          <Icon aria-hidden="true" className="w-full h-full" />
        )}
      </div>

      <span className="whitespace-nowrap leading-none">
        {message}
      </span>
    </div>
  );
};
