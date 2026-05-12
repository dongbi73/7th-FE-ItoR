import { create } from 'zustand';

export type ToastType = 'success' | 'error';

interface ToastState {
  isVisible: boolean;
  type: ToastType;
  message: string;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  type: 'success',
  message: '',
  showToast: (type, message) => {
    set({ isVisible: true, type, message });
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },
  hideToast: () => set({ isVisible: false }),
}));