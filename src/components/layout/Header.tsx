/**
 * Header.tsx
 * 
 * A reusable header component that follows iOS design principles.
 * Includes navigation, user menu, and theme toggle.
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBookOpen, FaMoon, FaSun, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { usersApi } from '@/lib/api';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation items
  const navItems: NavItem[] = [
    { label: 'الرئيسية', href: '/' },
    { label: 'تصفح الوثائق', href: '/browse' },
    { label: 'طلب وثائق', href: '/request' },
    { label: 'اتصل بنا', href: '/contact' },
  ];

  // Check for user authentication on mount
  useEffect(() => {
    // Check for dark mode preference
    const darkModeSaved = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModeSaved);
    
    if (darkModeSaved) {
      document.documentElement.classList.add('dark');
    }
    
    // Check for authenticated user
    const currentUser = usersApi.getCurrentUser();
    setUser(currentUser);
    
    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle logout
  const handleLogout = () => {
    usersApi.logout();
    setUser(null);
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-30 transition-all duration-300 backdrop-blur-md',
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 shadow-sm' : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse text-xl font-bold text-[#007AFF]">
              <FaBookOpen className="ml-2 h-6 w-6" />
              <span>المكتبة التاريخية</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <ul className={cn(
            "items-center space-y-4 md:space-y-0 md:space-x-6 md:flex md:rtl:space-x-reverse", 
            isMenuOpen 
              ? "absolute top-16 right-0 left-0 flex flex-col bg-white/95 p-4 shadow-md dark:bg-gray-900/95 z-20" 
              : "hidden"
          )}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "block py-2 transition-colors",
                    pathname === item.href 
                      ? "text-[#007AFF] font-medium" 
                      : "text-[#1C1C1E] dark:text-white hover:text-[#007AFF] dark:hover:text-[#007AFF]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[#F2F2F7] dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? "تفعيل الوضع المضيء" : "تفعيل الوضع المظلم"}
            >
              {isDarkMode ? (
                <FaSun className="h-5 w-5 text-[#FF9500]" />
              ) : (
                <FaMoon className="h-5 w-5 text-[#8E8E93]" />
              )}
            </button>
            
            {/* User menu or login button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-full hover:bg-[#F2F2F7] dark:hover:bg-gray-800 transition-colors"
                  aria-label="قائمة المستخدم"
                  aria-expanded={userMenuOpen}
                >
                  <FaUserCircle className="h-6 w-6 text-[#8E8E93] dark:text-gray-300" />
                  <span className="hidden md:inline-block text-[#1C1C1E] dark:text-white">
                    {user.name || 'المستخدم'}
                  </span>
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg overflow-hidden bg-white py-2 shadow-lg dark:bg-gray-800 border border-[#E5E5EA] dark:border-gray-700">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 hover:bg-[#F2F2F7] dark:hover:bg-gray-700 text-[#1C1C1E] dark:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/create-document"
                      className="flex items-center px-4 py-2 hover:bg-[#F2F2F7] dark:hover:bg-gray-700 text-[#1C1C1E] dark:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      إضافة وثيقة
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-[#FF3B30] hover:bg-[#F2F2F7] dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaSignOutAlt className="ml-2 h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="primary" 
                  size="sm"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-[#F2F2F7] dark:hover:bg-gray-800 md:hidden transition-colors"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6 text-[#1C1C1E] dark:text-white" />
              ) : (
                <FaBars className="h-6 w-6 text-[#1C1C1E] dark:text-white" />
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
} 