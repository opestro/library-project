'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaMoon, FaSun, FaUserCircle, FaSignOutAlt, FaBookOpen } from 'react-icons/fa';
import { usersApi } from '@/lib/api';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const pathname = usePathname();

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
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100" dir="rtl">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-white focus:z-50">
        تخطي إلى المحتوى الرئيسي
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <FaBookOpen className="ml-2 h-6 w-6" />
                <span>المكتبة التاريخية</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <ul className={cn(
              "items-center space-y-4 md:space-y-0 md:space-x-6 md:flex md:rtl:space-x-reverse", 
              isMenuOpen 
                ? "absolute top-16 right-0 left-0 flex flex-col bg-white p-4 shadow-md dark:bg-gray-800 z-20" 
                : "hidden"
            )}>
              <li>
                <Link 
                  href="/" 
                  className={cn(
                    "block py-2 hover:text-primary", 
                    pathname === "/" ? "text-primary font-medium" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/browse" 
                  className={cn(
                    "block py-2 hover:text-primary", 
                    pathname === "/browse" ? "text-primary font-medium" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  تصفح الوثائق
                </Link>
              </li>
              <li>
                <Link 
                  href="/request" 
                  className={cn(
                    "block py-2 hover:text-primary", 
                    pathname === "/request" ? "text-primary font-medium" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  طلب وثائق
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={cn(
                    "block py-2 hover:text-primary", 
                    pathname === "/contact" ? "text-primary font-medium" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
            
            {/* Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isDarkMode ? "تفعيل الوضع المضيء" : "تفعيل الوضع المظلم"}
              >
                {isDarkMode ? (
                  <FaSun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <FaMoon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              {/* User menu or login button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <FaUserCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    <span className="hidden md:inline-block">{user.name || 'المستخدم'}</span>
                  </button>
                  
                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        الملف الشخصي
                      </Link>
                      <Link
                        href="/create-document"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        إضافة وثيقة
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaSignOutAlt className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                >
                  تسجيل الدخول
                </Link>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md md:hidden"
                aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              >
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <h3 className="mb-4 flex items-center text-xl font-bold">
                <FaBookOpen className="ml-2 h-5 w-5" />
                المكتبة التاريخية
              </h3>
              <p className="text-gray-300">
                المكتبة التاريخية الرقمية هي مشروع يهدف إلى توثيق وحماية الوثائق التاريخية وعرضها بشكل رقمي مع ضمان أمانها وأصالتها.
              </p>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/browse" className="text-gray-300 hover:text-white">
                    تصفح الوثائق
                  </Link>
                </li>
                <li>
                  <Link href="/request" className="text-gray-300 hover:text-white">
                    طلب وثائق
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">الخدمات</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/browse" className="text-gray-300 hover:text-white">
                    البحث في الوثائق
                  </Link>
                </li>
                <li>
                  <Link href="/request" className="text-gray-300 hover:text-white">
                    طلب وثائق خاصة
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    البحث العلمي
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} المكتبة التاريخية الرقمية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 