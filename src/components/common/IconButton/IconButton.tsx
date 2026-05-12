import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
  isActive?: boolean;
  size?: 'frame' | 'md' | 'sm';
}

const sizeClasses = {
  frame: 'h-10 w-10 [&>svg]:h-6 [&>svg]:w-6',
  md: 'h-6 w-6 [&>svg]:h-6 [&>svg]:w-6',
  sm: 'h-[14px] w-[14px] [&>svg]:h-[14px] [&>svg]:w-[14px]',
};

export const IconButton = ({
  icon,
  isActive = false,
  size = 'frame',
  className,
  type,
  ...props
}: IconButtonProps) => {
  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center rounded-xs border border-transparent bg-transparent text-gray-27 transition-colors',
        'hover:bg-gray-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-primary',
        isActive && 'bg-gray-90',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};
