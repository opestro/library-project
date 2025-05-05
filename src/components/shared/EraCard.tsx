/**
 * EraCard.tsx
 * 
 * A reusable card component for displaying historical eras.
 * Used in the homepage and browse sections.
 */
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface EraCardProps {
  /**
   * The era title (e.g., "العصر القديم")
   */
  title: string;
  /**
   * A brief description of the era
   */
  description: string;
  /**
   * Link to view documents from this era
   */
  href: string;
  /**
   * Optional background image URL
   */
  backgroundImage?: string;
  /**
   * Optional document count for this era
   */
  documentCount?: number;
  /**
   * Optional badge text
   */
  badge?: string;
  /**
   * Optional custom class name
   */
  className?: string;
}

export function EraCard({
  title,
  description,
  href,
  backgroundImage,
  documentCount,
  badge,
  className = '',
}: EraCardProps) {
  const hasBackground = !!backgroundImage;
  
  return (
    <Link href={href} className="block h-full">
      <Card 
        className={cn(
          'h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md',
          hasBackground ? 'text-white' : '',
          className
        )}
        padded={false}
      >
        {hasBackground ? (
          <div 
            className="relative h-full overflow-hidden p-5"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {badge && (
                  <Badge variant="info" size="sm" rounded>{badge}</Badge>
                )}
              </div>
              <p className="mb-4 mt-2 text-white text-opacity-90">{description}</p>
              {documentCount !== undefined && (
                <div className="mt-auto text-sm text-white text-opacity-80">
                  {documentCount} وثيقة متاحة
                </div>
              )}
              <span className="mt-2 inline-flex items-center text-[#5AC8FA] hover:underline">
                تصفح الوثائق
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#1C1C1E] dark:text-white">{title}</h3>
              {badge && (
                <Badge variant="info" size="sm" rounded>{badge}</Badge>
              )}
            </div>
            <p className="mb-4 mt-2 text-[#8E8E93] dark:text-gray-300">{description}</p>
            {documentCount !== undefined && (
              <div className="mt-auto text-sm text-[#8E8E93] dark:text-gray-400">
                {documentCount} وثيقة متاحة
              </div>
            )}
            <span className="mt-2 inline-flex items-center text-[#007AFF] hover:underline">
              تصفح الوثائق
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
} 