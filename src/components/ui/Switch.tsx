/**
 * Switch.tsx
 * 
 * A reusable switch component that follows iOS design principles.
 * Used for toggling between two states (on/off).
 */
import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Whether the switch is on or off
   */
  checked?: boolean;
  /**
   * Switch size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Label text for the switch
   */
  label?: string;
  /**
   * Optional text to show when switch is on 
   */
  onLabel?: string;
  /**
   * Optional text to show when switch is off
   */
  offLabel?: string;
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  /**
   * Optional custom container class names
   */
  containerClassName?: string;
  /**
   * Optional custom class names for the switch
   */
  switchClassName?: string;
  /**
   * Optional custom class names for the label
   */
  labelClassName?: string;
}

export const Switch = ({
  checked = false,
  size = 'md',
  label,
  onLabel,
  offLabel,
  labelPosition = 'right',
  disabled = false,
  containerClassName = '',
  switchClassName = '',
  labelClassName = '',
  className = '',
  ...props
}: SwitchProps) => {
  const containerClasses = cn(
    'flex items-center',
    labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
    containerClassName
  );
  
  const switchSizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6', 
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };
  
  const trackClasses = cn(
    'relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2',
    switchSizes[size].track,
    checked ? 'bg-[#34C759]' : 'bg-[#E5E5EA] dark:bg-gray-700',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    switchClassName
  );
  
  const thumbClasses = cn(
    'pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out',
    switchSizes[size].thumb,
    checked ? switchSizes[size].translate : 'translate-x-0'
  );
  
  const labelClasses = cn(
    'select-none',
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
    labelPosition === 'left' ? 'mr-3' : 'ml-3',
    disabled ? 'opacity-50' : '',
    labelClassName
  );
  
  return (
    <div className={containerClasses}>
      <button
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        className={trackClasses}
        onClick={!disabled ? () => {
          if (props.onChange) {
            const event = {
              target: {
                checked: !checked,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            props.onChange(event);
          }
        } : undefined}
        disabled={disabled}
      >
        <span className={thumbClasses} />
        
        {checked && onLabel && (
          <span className="mr-6 text-xs font-medium text-white">{onLabel}</span>
        )}
        
        {!checked && offLabel && (
          <span className="ml-6 text-xs font-medium text-gray-500">{offLabel}</span>
        )}
      </button>
      
      {label && <span className={labelClasses}>{label}</span>}
      
      {/* Hidden input for form submission */}
      <input 
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}; 