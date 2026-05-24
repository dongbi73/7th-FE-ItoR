import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StatusMessageProps {
  children: ReactNode;
  className?: string;
}

export const StatusMessage = ({ children, className }: StatusMessageProps) => {
  return (
    <div className={cn('px-4 py-12 text-center text-[14px] text-gray-56', className)}>
      {children}
    </div>
  );
};
