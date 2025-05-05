/**
 * utils.ts
 * 
 * Utility functions used throughout the application.
 */
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single className string.
 * Uses clsx for conditional classes and twMerge to properly merge Tailwind classes.
 * 
 * @example 
 * cn('text-red-500', isActive && 'bg-blue-500', 'p-4', isBold ? 'font-bold' : 'font-normal')
 * 
 * @param inputs - Class values to be merged
 * @returns A merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object to a localized string format
 * 
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'ar-SA')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate a string to a specified maximum length and append an ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a random ID
 * 
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Debounce a function to limit how often it can be called
 * 
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
} 