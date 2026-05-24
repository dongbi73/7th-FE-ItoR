import { cn } from '@/utils/cn';

interface BlankProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-[20px]',
  md: 'h-[32px]',
  lg: 'h-[64px]',
} as const;

export const Blank = ({ size = 'sm', className }: BlankProps) => {
  return <div className={cn('w-full', sizeClasses[size], className)} />;
};
