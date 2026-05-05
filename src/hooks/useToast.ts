import { useToastStore } from '@/store/useToastStore';
import type { ToastType } from '@/store/useToastStore';

interface ShowToastProps {
  type: ToastType;
  message: string;
}

export const useToast = () => {
  const { showToast, hideToast } = useToastStore();

  return {
    showToast: ({ type, message }: ShowToastProps) => showToast(type, message),
    hideToast,
  };
};