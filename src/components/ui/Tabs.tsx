/**
 * Tabs.tsx
 * 
 * A reusable tabs component that follows iOS design principles.
 * Provides a way to switch between different views.
 */
import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;
  /**
   * Tab label text
   */
  label: string;
  /**
   * Optional icon to display with the label
   */
  icon?: ReactNode;
  /**
   * Optional badge to display with the label
   */
  badge?: string | number;
  /**
   * Optional disabled state
   */
  disabled?: boolean;
}

export interface TabsProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];
  /**
   * Active tab ID
   */
  activeTab?: string;
  /**
   * Callback fired when a tab is clicked
   */
  onChange?: (tabId: string) => void;
  /**
   * Visual appearance of the tabs
   */
  variant?: 'default' | 'pills' | 'underline' | 'segmented';
  /**
   * Tab size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether tabs should take full width
   */
  fullWidth?: boolean;
  /**
   * Optional custom class names
   */
  className?: string;
}

export const Tabs = ({
  tabs,
  activeTab: externalActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) => {
  // Internal state if no external control is provided
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);
  
  // Use external or internal active tab
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  // Handle tab click
  const handleTabClick = (tabId: string) => {
    if (!onChange) {
      setInternalActiveTab(tabId);
    } else {
      onChange(tabId);
    }
  };
  
  // Base container styles
  const containerStyles = {
    default: 'border-b border-[#E5E5EA] dark:border-gray-700',
    pills: 'mb-2',
    underline: 'border-b border-[#E5E5EA] dark:border-gray-700',
    segmented: 'p-1 bg-[#F2F2F7] rounded-lg dark:bg-gray-800',
  };
  
  // Base tab styles
  const baseTabStyles = {
    default: 'pb-2 border-b-2 border-transparent hover:text-[#007AFF]',
    pills: 'rounded-full hover:bg-[#F2F2F7] dark:hover:bg-gray-800',
    underline: 'pb-2 border-b-2 border-transparent hover:text-[#007AFF]',
    segmented: 'rounded-md text-[#8E8E93]',
  };
  
  // Active tab styles
  const activeTabStyles = {
    default: 'text-[#007AFF] border-[#007AFF]',
    pills: 'bg-[#007AFF] text-white hover:bg-[#0071EB]',
    underline: 'text-[#007AFF] border-[#007AFF]',
    segmented: 'bg-white text-[#1C1C1E] shadow-sm dark:bg-gray-700 dark:text-white',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };
  
  return (
    <div className={cn(
      'flex overflow-x-auto scrollbar-hide',
      containerStyles[variant],
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          disabled={tab.disabled}
          className={cn(
            'flex items-center font-medium transition-all whitespace-nowrap',
            baseTabStyles[variant],
            sizeStyles[size],
            tab.id === activeTab ? activeTabStyles[variant] : '',
            tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            fullWidth ? 'flex-1 justify-center' : 'mr-2'
          )}
          aria-selected={tab.id === activeTab}
          role="tab"
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className={cn(
              'ml-2 rounded-full px-1.5 text-xs',
              tab.id === activeTab && variant === 'pills' 
                ? 'bg-white text-[#007AFF]' 
                : 'bg-[#E5E5EA] text-[#8E8E93] dark:bg-gray-700 dark:text-gray-300'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}; 