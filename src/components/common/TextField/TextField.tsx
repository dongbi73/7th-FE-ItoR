import React, { useId, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helpText?: string;
  isError?: boolean;
  size?: keyof typeof styles.inputSizes;
  tone?: keyof typeof styles.inputStates;
}

export const TextField =forwardRef<HTMLInputElement, TextFieldProps>(
({
  label,
  helpText,
  isError = false,
  size = 'default',
  tone = 'default',
  disabled = false,
  className,
  type = 'text',
  ...props
  }, ref
) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const helpTextId = helpText ? `${inputId}-help-text` : undefined;
  const describedBy = [props['aria-describedby'], helpTextId].filter(Boolean).join(' ') || undefined;
  const sizeStyles = styles.textFieldSizes[size];
  const inputTone = disabled ? 'disabled' : isError ? 'active' : tone;
  
  return (
    <div className={cn('flex w-full flex-col', sizeStyles.wrapper, className)}>
      
      <div className={sizeStyles.labelInputWrapper}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn(
            sizeStyles.label,
            disabled && 'text-gray-78'
          )}
        >
          {label}
        </label>
      )}

      <input 
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={isError || undefined}
        aria-describedby={describedBy}
        className={cn(
          styles.inputBase,
          styles.inputSizes[size],
          styles.inputStates[inputTone]
        )}
        {...props}
      />

      </div>


      {helpText && (
        <span 
          id={helpTextId}
          className={cn(
            'mt-0.5',
            sizeStyles.helpText,
            isError && 'text-negative'
          )}
        >
          {helpText}
        </span>
      )}
    </div>
  );
});

TextField.displayName = 'TextField'; 
