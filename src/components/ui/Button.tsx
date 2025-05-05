/**
 * Button.tsx
 * 
 * A reusable button component that follows iOS design principles.
 * Supports different variants (primary, secondary, outline),
 * sizes, and can include icons.
 */
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
  /**
   * The size of the button
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Icon to display before the button text
   */
  leftIcon?: ReactNode;
  /**
   * Icon to display after the button text
   */
  rightIcon?: ReactNode;
  /**
   * Used for full-width buttons
   */
  fullWidth?: boolean;
  /**
   * Optional class names for custom styling
   */
  className?: string;
  /**
   * Button content
   */
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  // Base styles that apply to all buttons
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-base focus:outline-none active:scale-[0.98]";
  
  // Style variations based on variant prop
  const variantStyles = {
    primary: "bg-ios-blue text-white hover:bg-[#0071EB] focus:ring-2 focus:ring-ios-blue focus:ring-offset-2 rounded-full",
    secondary: "bg-gray-50 text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    outline: "bg-transparent border border-ios-blue text-ios-blue hover:bg-ios-blue/10 focus:ring-2 focus:ring-ios-blue focus:ring-offset-2 rounded-full",
    ghost: "bg-transparent text-ios-blue hover:bg-gray-50 focus:ring-2 focus:ring-ios-blue focus:ring-offset-2 rounded-full dark:hover:bg-gray-800",
    danger: "bg-ios-red text-white hover:bg-[#E0352B] focus:ring-2 focus:ring-ios-red focus:ring-offset-2 rounded-full",
    icon: "w-9 h-9 p-0 rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
  };
  
  // Size variations
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-4 py-2 gap-2",
    lg: "text-lg px-6 py-3 gap-2.5",
  };
  
  // Only apply size styles if not an icon button
  const appliedSizeStyles = variant === 'icon' ? '' : sizeStyles[size];
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";
  
  return (
    <button 
      className={cn(
        baseStyles,
        variantStyles[variant],
        appliedSizeStyles,
        disabledStyles,
        widthStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
}; 