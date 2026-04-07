import { useEffect } from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';
import { ErrorOutlineIcon, DoneIcon } from '@/assets/icons';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error';
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const Icon = type === 'error' ? ErrorOutlineIcon : DoneIcon;

  return (
    <div className={cn(styles.toastBase, styles.toastVariants[type])}>
      <div className="shrink-0 flex items-center justify-center w-5 h-5">
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={type} className="w-full h-full object-contain" />
        ) : (
          <Icon className="w-full h-full" />
        )}
      </div>

      <span className="whitespace-nowrap leading-none">
        {message}
      </span>
    </div>
  );
};