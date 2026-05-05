import React from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';
import type { ButtonVariant } from './variants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconClassName?: string;
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primaryOutline',
  icon,
  iconClassName,
  children,
  className,
  ...props
}: ButtonProps) => {

  const iconSize = variant === 'ghost' ? 'w-3.5 h-3.5' : 'w-6 h-6'; 

  return (
    <button
      type={props.type ?? 'button'}
      className={cn(styles.buttonBase, styles.buttonVariants[variant], className)}
      {...props}
    >
      {icon && (
        <span className={cn('flex items-center justify-center', iconClassName ?? iconSize)}>
          {icon}
        </span>
      )}
      
      {children && <span>{children}</span>}
    </button>
  );
};
