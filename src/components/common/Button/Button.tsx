import React from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof styles.buttonVariants;
  icon?: React.ReactNode; 
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primaryOutline',
  icon,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(styles.buttonBase, styles.buttonVariants[variant], className)}
      {...props}
    >
      {icon && (
        <span className="w-5.5 h-5.5 flex items-center justify-center">
          {icon}
        </span>
      )}
      
      <span>{children}</span>
    </button>
  );
};