/**
 * Card.tsx
 * 
 * A reusable card component that follows iOS design principles.
 * Provides a clean, slightly elevated surface to group related content.
 */
import React, { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Optional additional padding
   */
  padded?: boolean;
  /**
   * Optional custom border radius
   */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional shadow depth
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Optional border
   */
  bordered?: boolean;
  /**
   * Optional hover effect
   */
  hoverable?: boolean;
  /**
   * Optional background color
   */
  bgColor?: 'white' | 'gray' | 'transparent';
  /**
   * Optional custom class names
   */
  className?: string;
}

export const Card = ({
  children,
  padded = true,
  radius = 'lg',
  shadow = 'sm',
  bordered = true,
  hoverable = true,
  bgColor = 'white',
  className = '',
  ...props
}: CardProps) => {
  const radiusStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };
  
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };
  
  const bgStyles = {
    white: 'bg-theme-background',
    gray: 'bg-gray-50 dark:bg-gray-800',
    transparent: 'bg-transparent',
  };
  
  const paddingStyles = padded ? 'p-4 md:p-6' : '';
  const borderStyles = bordered ? 'border border-gray-100 dark:border-gray-700' : '';
  const hoverStyles = hoverable ? 'transition-all duration-base hover:shadow-md hover:-translate-y-1' : '';
  
  return (
    <div 
      className={cn(
        radiusStyles[radius],
        shadowStyles[shadow],
        bgStyles[bgColor],
        paddingStyles,
        borderStyles,
        hoverStyles,
        'h-full flex flex-col',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardImage = ({
  src,
  alt,
  className = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => (
  <img 
    src={src} 
    alt={alt} 
    className={cn('w-full rounded-md mb-4 h-48 object-cover', className)} 
    {...props} 
  />
);

export const CardHeader = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-semibold text-theme-text dark:text-white', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-theme-text-secondary dark:text-gray-400', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 flex flex-col py-2', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center mt-auto pt-4', className)} {...props}>
    {children}
  </div>
);

export const CardMeta = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex gap-4 my-4 text-sm text-theme-text-tertiary', className)} {...props}>
    {children}
  </div>
); 