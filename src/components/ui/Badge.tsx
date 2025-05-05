/**
 * Badge.tsx
 * 
 * A reusable badge component that follows iOS design principles.
 * Used for status indicators, counters, or labels.
 */
import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * The visual style of the badge
   */
  variant?: BadgeVariant;
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Determines if the badge should be rounded or pill-shaped
   */
  rounded?: boolean;
  /**
   * Optional custom class names
   */
  className?: string;
  /**
   * Badge content
   */
  children: React.ReactNode;
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  const variantStyles = {
    default: 'bg-ios-blue/10 text-ios-blue',
    primary: 'bg-ios-blue/10 text-ios-blue',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    success: 'bg-ios-green/10 text-ios-green',
    warning: 'bg-ios-orange/10 text-ios-orange',
    danger: 'bg-ios-red/10 text-ios-red',
    info: 'bg-ios-teal/10 text-ios-teal',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1',
  };
  
  const radiusStyles = rounded ? 'rounded-full' : 'rounded-md';
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        radiusStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}; 