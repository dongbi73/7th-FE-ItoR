import { Toast } from './Toast';
import { useToastStore } from '@/store/useToastStore';

export const ToastRenderer = () => {
  const { isVisible, type, message, hideToast } = useToastStore();

  if (!isVisible) return null;

  return <Toast type={type} message={message} onClose={hideToast} />;
};
