import { cn } from '@/utils/cn';

interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => {
  return (
    <div className={cn('w-full max-w-[644px] px-4 py-0', className)}>
      <hr aria-hidden="true" className="w-full max-w-[612px] border-0 border-t border-divider" />
    </div>
  );
};
