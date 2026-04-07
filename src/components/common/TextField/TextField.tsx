import React, { useId } from 'react';
import { cn } from '@/utils/cn';
import * as styles from './variants';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;          
  helpText?: string;       
  isError?: boolean;       
}

export const TextField = ({
  label,
  helpText,
  isError = false,
  disabled = false,
  className,
  type = 'text',
  ...props
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn(
            "text-[14px] font-medium text-text-label",
            disabled && "text-field-disabled-text" 
          )}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        disabled={disabled}
        className={cn(
          styles.inputBase,
          disabled 
            ? styles.inputStates.disabled 
            : isError 
              ? styles.inputStates.error 
              : styles.inputStates.default
        )}
        {...props}
      />

      {helpText && (
        <span 
          className={cn(
            "text-[12px] text-slate-500 mt-0.5",
            isError && "text-field-error-text" 
          )}
        >
          {isError && "* "}{helpText}
        </span>
      )}
    </div>
  );
};