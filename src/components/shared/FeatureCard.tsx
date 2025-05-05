/**
 * FeatureCard.tsx
 * 
 * iOS-style feature card component that showcases library features
 * with an icon, title, and description.
 */
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  /**
   * The icon to display (Font Awesome or other icon)
   */
  icon: ReactNode;
  /**
   * The feature title
   */
  title: string;
  /**
   * Description of the feature
   */
  description: string;
  /**
   * Optional custom class names
   */
  className?: string;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  className 
}: FeatureCardProps) {
  return (
    <div className={cn('feature-card', className)}>
      <div className="feature-icon">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-theme-text">{title}</h3>
      
      <p className="text-sm text-theme-text-secondary">
        {description}
      </p>
    </div>
  );
} 