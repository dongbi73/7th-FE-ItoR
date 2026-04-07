import { cn } from '@/utils/cn';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast = ({ message, isVisible }: ToastProps) => {
  return (
    <div 
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium shadow-lg transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      {message}
    </div>
  );
};