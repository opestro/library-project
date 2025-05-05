/**
 * DocumentCard.tsx
 * 
 * A reusable card component for displaying historical documents.
 * Used in browse and search result pages.
 */
import React from 'react';
import Link from 'next/link';
import { FaEye, FaDownload, FaBookmark, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export interface DocumentCardProps {
  /**
   * Document ID
   */
  id: string;
  /**
   * Document title
   */
  title: string;
  /**
   * Brief description of the document
   */
  description?: string;
  /**
   * Document cover image URL
   */
  imageUrl?: string;
  /**
   * Document publication date
   */
  date?: string;
  /**
   * Category/type of document
   */
  category?: string;
  /**
   * Historical era the document belongs to
   */
  era?: string;
  /**
   * Document page count
   */
  pageCount?: number;
  /**
   * Document view count
   */
  viewCount?: number;
  /**
   * Is the document bookmarked by current user
   */
  isBookmarked?: boolean;
  /**
   * Is the document a premium/locked document
   */
  isPremium?: boolean;
  /**
   * Function to handle bookmark toggle
   */
  onBookmark?: () => void;
  /**
   * Layout variant
   */
  variant?: 'horizontal' | 'vertical' | 'compact';
  /**
   * Optional custom class
   */
  className?: string;
}

export function DocumentCard({
  id,
  title,
  description,
  imageUrl,
  date,
  category,
  era,
  pageCount,
  viewCount,
  isBookmarked = false,
  isPremium = false,
  onBookmark,
  variant = 'vertical',
  className,
}: DocumentCardProps) {
  const formattedDate = date ? formatDate(date) : '';
  
  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  const documentImage = imageUrl || defaultImage;
  
  // Base URL for document details
  const documentUrl = `/document/${id}`;
  
  // Card classes based on variant
  const cardClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-col md:flex-row md:h-[200px]',
    compact: 'flex flex-row h-[120px]',
  };
  
  // Image container classes based on variant
  const imageClasses = {
    vertical: 'aspect-[3/2] w-full overflow-hidden',
    horizontal: 'aspect-[3/2] w-full md:w-[240px] overflow-hidden',
    compact: 'w-[100px] h-full overflow-hidden',
  };
  
  // Content container classes based on variant
  const contentClasses = {
    vertical: 'flex flex-col flex-1 p-4',
    horizontal: 'flex flex-col flex-1 p-4',
    compact: 'flex flex-col flex-1 p-3',
  };
  
  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md group',
        cardClasses[variant],
        className
      )}
      shadow="sm"
      padded={false}
      bordered
    >
      {/* Document image */}
      <div className={cn(imageClasses[variant])}>
        <Link href={documentUrl}>
          <div className="relative h-full w-full">
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${documentImage})` }}
            />
            
            {/* Overlay for premium docs */}
            {isPremium && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="warning" size="sm" rounded>حصري</Badge>
              </div>
            )}
            
            {/* Category badge */}
            {category && (
              <div className="absolute top-2 right-2">
                <Badge variant="info" size="sm">{category}</Badge>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      {/* Document content */}
      <div className={cn(contentClasses[variant])}>
        {/* Title and bookmark icon */}
        <div className="flex items-start justify-between">
          <Link href={documentUrl} className="group-hover:text-[#007AFF] transition-colors">
            <h3 className={cn(
              'font-semibold text-[#1C1C1E] dark:text-white line-clamp-2',
              variant === 'compact' ? 'text-base' : 'text-lg'
            )}>
              {title}
            </h3>
          </Link>
          
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={cn(
                'p-1 rounded-full transition-colors',
                isBookmarked 
                  ? 'text-[#FF9500] hover:text-[#FF8000]' 
                  : 'text-[#8E8E93] hover:text-[#007AFF]'
              )}
              aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'إضافة إلى المحفوظات'}
            >
              <FaBookmark className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Description (if not compact) */}
        {description && variant !== 'compact' && (
          <p className="mt-2 text-sm text-[#8E8E93] dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Metadata */}
        <div className={cn(
          'flex text-xs text-[#8E8E93] dark:text-gray-400 space-x-4 rtl:space-x-reverse',
          variant === 'vertical' ? 'mt-3' : 'mt-2' 
        )}>
          {date && (
            <div className="flex items-center">
              <FaCalendarAlt className="ml-1 h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          )}
          
          {era && (
            <div className="flex items-center">
              <FaTag className="ml-1 h-3 w-3" />
              <span>{era}</span>
            </div>
          )}
          
          {pageCount && (
            <div className="flex items-center">
              <span>{pageCount} صفحة</span>
            </div>
          )}
          
          {viewCount !== undefined && (
            <div className="flex items-center">
              <FaEye className="ml-1 h-3 w-3" />
              <span>{viewCount}</span>
            </div>
          )}
        </div>
        
        {/* Actions (if not compact) */}
        {variant !== 'compact' && (
          <div className="mt-auto pt-3 flex justify-between items-center">
            <Link href={documentUrl}>
              <Button size="sm" variant="primary">
                عرض الوثيقة
              </Button>
            </Link>
            
            <Link href={`${documentUrl}/download`}>
              <Button size="sm" variant="ghost" leftIcon={<FaDownload className="h-3 w-3" />}>
                تنزيل
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
} 