import { cn } from '@/utils/cn';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
};