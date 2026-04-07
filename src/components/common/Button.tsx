import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  
  // 기본 스타일
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // 변형(Variant) 스타일
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
  };

  // 사이즈 스타일
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className // 외부에서 추가로 넣는 margin 등을 위해 마지막에 배치
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
      ) : null}
      {children}
    </button>
  );
};