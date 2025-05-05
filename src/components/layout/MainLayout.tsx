/**
 * MainLayout.tsx
 * 
 * A reusable layout component that includes the common page structure.
 * Wraps content with header, footer, and main content area.
 */
'use client';

import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  /**
   * Content to be displayed in the main area
   */
  children: ReactNode;
  /**
   * Whether to hide the footer
   */
  hideFooter?: boolean;
  /**
   * Class name for the main content area
   */
  contentClassName?: string;
}

export function MainLayout({
  children,
  hideFooter = false,
  contentClassName = '',
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1C1C1E] dark:bg-gray-900 dark:text-white" dir="rtl">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-[#007AFF] focus:text-white focus:z-50">
        تخطي إلى المحتوى الرئيسي
      </a>
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main id="main-content" className={`flex-1 ${contentClassName}`}>
        {children}
      </main>
      
      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
} 