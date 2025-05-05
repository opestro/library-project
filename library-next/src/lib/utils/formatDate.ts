/**
 * Format date to a localized string
 * @param dateString Date string to format
 * @param locale Locale to use for formatting (defaults to 'ar-SA' for Arabic - Saudi Arabia)
 * @param options Optional date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  locale: string = 'ar-SA',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!dateString) {
    return '';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format date relative to current time (e.g., "2 days ago")
 * @param dateString Date string to format
 * @param locale Locale to use for formatting (defaults to 'ar-SA' for Arabic - Saudi Arabia)
 * @returns Relative time string
 */
export function formatRelativeTime(
  dateString: string | Date | null | undefined,
  locale: string = 'ar-SA'
): string {
  if (!dateString) {
    return '';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'الآن';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
} 