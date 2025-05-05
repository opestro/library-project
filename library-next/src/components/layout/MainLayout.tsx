'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBook, FaSearch, FaPaperPlane, FaUserCircle, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: FaBook },
    { href: '/browse', label: 'تصفح الوثائق', icon: FaSearch },
    { href: '/request', label: 'طلب وثيقة', icon: FaPaperPlane },
    { href: '/contact', label: 'اتصل بنا', icon: FaPaperPlane },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-right dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaBook className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">المكتبة التاريخية</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaUserCircle className="h-5 w-5" />
              <span className="hidden md:inline">حسابي</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            >
              {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:hidden">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 py-2 font-medium transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary" : "text-gray-700 dark:text-gray-300"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* About */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">عن المكتبة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                المكتبة التاريخية الرقمية هي مشروع يهدف إلى توفير وثائق تاريخية رقمية للباحثين والمهتمين بالتاريخ.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-400">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400">
                    شروط الاستخدام
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">اتصل بنا</h3>
              <address className="not-italic text-gray-600 dark:text-gray-400">
                <p>البريد الإلكتروني: info@historicallibrary.com</p>
                <p>الهاتف: +966 12 345 6789</p>
              </address>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} المكتبة التاريخية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 