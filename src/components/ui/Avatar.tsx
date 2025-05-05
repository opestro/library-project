/**
 * Avatar.tsx
 * 
 * A reusable avatar component that follows iOS design principles.
 * Displays user images or initials with a fallback option.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image URL for the avatar
   */
  src?: string;
  /**
   * Alternative text for the avatar image
   */
  alt?: string;
  /**
   * Fallback initials if the image fails to load
   */
  initials?: string;
  /**
   * Size of the avatar
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Shape of the avatar
   */
  shape?: 'circle' | 'square';
  /**
   * Optional border
   */
  bordered?: boolean;
  /**
   * Optional badge to display on the avatar
   */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  /**
   * Optional custom class name for the avatar
   */
  className?: string;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  shape = 'circle',
  bordered = false,
  status = 'none',
  className = '',
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };
  
  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };
  
  const statusSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };
  
  const statusStyles = {
    online: 'bg-[#34C759]',
    offline: 'bg-[#8E8E93]',
    away: 'bg-[#FF9500]',
    busy: 'bg-[#FF3B30]',
    none: 'hidden',
  };
  
  const borderStyles = bordered ? 'border-2 border-white dark:border-gray-800' : '';
  
  // Get the background color for the avatar fallback based on the initials
  const getBackgroundColor = (initials: string) => {
    const colors = [
      'bg-[#FF9500]', // Orange
      'bg-[#FF3B30]', // Red
      'bg-[#34C759]', // Green
      'bg-[#007AFF]', // Blue
      'bg-[#5856D6]', // Indigo
      'bg-[#AF52DE]', // Purple
      'bg-[#FF2D55]', // Pink
    ];
    
    // Simple hash function to get a consistent color for the same initials
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div 
      className={cn('relative inline-flex flex-shrink-0 items-center justify-center', className)}
      {...props}
    >
      <div 
        className={cn(
          'overflow-hidden flex items-center justify-center',
          sizeStyles[size],
          shapeStyles[shape],
          borderStyles,
          !src || imageError ? getBackgroundColor(initials || alt.charAt(0)) : 'bg-gray-100'
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover')}
            onError={handleImageError}
          />
        ) : (
          <span className="font-medium text-white">
            {initials || alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {status !== 'none' && (
        <span 
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-gray-800',
            statusStyles[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
}; 