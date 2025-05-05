"use client";
/**
 * Navigation.tsx
 * 
 * iOS-style responsive navigation component for the Digital Historical Library.
 * Includes logo, navigation links, authentication buttons, and mobile menu support.
 */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  /**
   * Additional class names for the navigation container
   */
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll events to add a scrolled class for visual effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle menu state for mobile view
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header>
      <div className="container">
        <nav className={cn(
          'nav',
          scrolled && 'nav-scrolled',
          className
        )}>
          <div className="nav-logo">
            <i className="fas fa-book-open"></i>
            المكتبة التاريخية
          </div>
          
          <ul className={cn('nav-links', isMenuOpen && 'active')} id="menu">
            <li><Link href="/" className="active" aria-current="page">الرئيسية</Link></li>
            <li><Link href="#ages">العصور</Link></li>
            <li><Link href="#categories">التصنيفات</Link></li>
            <li><Link href="#features">المميزات</Link></li>
            <li><Link href="#collections">المجموعات</Link></li>
            <li><Link href="#contact">اتصل بنا</Link></li>
          </ul>
          
          <div className="nav-actions">
            <Button variant="outline" size="sm" className="gap-2">
              <i className="fas fa-sign-in-alt"></i>
              تسجيل الدخول
            </Button>
            
            <Button variant="icon" aria-label="تغيير الوضع المظلم">
              <i className="fas fa-moon"></i>
            </Button>
            
            <button 
              className="nav-menu-btn" 
              aria-expanded={isMenuOpen} 
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} 
              aria-controls="menu"
              onClick={toggleMenu}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
} 