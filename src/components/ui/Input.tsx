/**
 * Input.tsx
 * 
 * A reusable input component that follows iOS design principles.
 * Supports different states, prefixes/suffixes, and validation.
 */
import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /**
   * Content to display before the input field
   */
  prefix?: ReactNode;
  /**
   * Content to display after the input field
   */
  suffix?: ReactNode;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Required indicator for the label
   */
  required?: boolean;
  /**
   * Whether the input is in a loading state
   */
  loading?: boolean;
  /**
   * Custom container styles
   */
  containerClassName?: string;
  /**
   * Custom input styles
   */
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  prefix,
  suffix,
  error,
  helperText,
  label,
  required = false,
  loading = false,
  className = '',
  containerClassName = '',
  inputClassName = '',
  disabled,
  ...props
}, ref) => {
  const hasError = !!error;
  
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-theme-text dark:text-gray-200">
          {label}
          {required && <span className="mr-1 text-ios-red">*</span>}
        </label>
      )}
      
      <div className={cn(
        'flex w-full items-center overflow-hidden rounded-full border bg-theme-background transition-all duration-base',
        hasError 
          ? 'border-ios-red focus-within:border-ios-red focus-within:ring-1 focus-within:ring-ios-red' 
          : 'border-gray-100 focus-within:border-ios-blue focus-within:ring-1 focus-within:ring-ios-blue',
        disabled ? 'bg-gray-50 opacity-60 dark:bg-gray-800' : '',
        className
      )}>
        {prefix && (
          <div className="flex items-center px-4 text-gray-500">
            {prefix}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full border-0 bg-transparent py-3 px-4 text-theme-text placeholder:text-gray-500 focus:outline-none focus:ring-0 dark:text-white',
            prefix ? 'pr-0' : '',
            suffix ? 'pl-0' : '',
            inputClassName
          )}
          disabled={disabled || loading}
          aria-invalid={hasError}
          {...props}
        />
        
        {(suffix || loading) && (
          <div className="flex items-center px-4 text-gray-500">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            ) : (
              suffix
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={cn(
          'mt-1.5 text-xs',
          error ? 'text-ios-red' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input'; 