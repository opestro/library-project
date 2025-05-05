/**
 * Footer.tsx
 * 
 * iOS-style footer component for the Digital Historical Library.
 * Includes branding, links, contact information, and copyright.
 */
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps {
  /**
   * Additional class names for the footer container
   */
  className?: string;
}

export function Footer({ className }: FooterProps) {
  // Quick links for navigation
  const quickLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'العصور', href: '#ages' },
    { label: 'التصنيفات', href: '#categories' },
    { label: 'المميزات', href: '#features' },
    { label: 'المجموعات', href: '#collections' },
    { label: 'اتصل بنا', href: '#contact' },
  ];
  
  // Library services
  const services = [
    { label: 'البحث في الوثائق', href: '/browse' },
    { label: 'طلب وثائق خاصة', href: '/request' },
    { label: 'البحث العلمي', href: '/research' },
    { label: 'التحليل النصي', href: '/analysis' },
    { label: 'التحقق من الوثائق', href: '/verify' },
    { label: 'الترجمة الآلية', href: '/translate' },
  ];
  
  // Social media links
  const socialLinks = [
    { icon: 'facebook-f', href: '#', label: 'فيسبوك' },
    { icon: 'twitter', href: '#', label: 'تويتر' },
    { icon: 'instagram', href: '#', label: 'انستغرام' },
    { icon: 'linkedin-in', href: '#', label: 'لينكد إن' },
  ];
  
  return (
    <footer className={cn('footer', className)}>
      <div className="container">
        <div className="footer-content">
          {/* Brand/About Us */}
          <div className="footer-brand">
            <h3 className="footer-heading">
              <i className="fas fa-shield-alt"></i>
              المكتبة التاريخية
            </h3>
            <p>المكتبة التاريخية الرقمية هي مشروع يهدف إلى توثيق وحماية الوثائق التاريخية وعرضها بشكل رقمي مع ضمان أمانها وأصالتها.</p>
            <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <i className="fas fa-lock text-ios-blue ml-3"></i>
              <span className="text-sm">محمي بتقنية الذكاء الاصطناعي</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">روابط سريعة</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="footer-heading">الخدمات</h3>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index}>
                  <Link href={service.href} className="footer-link">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="footer-heading">تواصل معنا</h3>
            <ul className="footer-links">
              <li className="flex items-center gap-2 mb-3">
                <i className="fas fa-envelope text-ios-blue"></i>
                <span>info@digitallibrary.org</span>
              </li>
              <li className="flex items-center gap-2 mb-3">
                <i className="fas fa-phone-alt text-ios-blue"></i>
                <span>+966 12 345 6789</span>
              </li>
              <li className="flex items-center gap-2 mb-3">
                <i className="fas fa-map-marker-alt text-ios-blue"></i>
                <span>شارع المعرفة، حي الثقافة، الرياض</span>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  className="social-icon" 
                  aria-label={social.label}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="copyright">
          <p>© ٢٠٢٣ المكتبة التاريخية الرقمية. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="text-sm hover:text-ios-blue">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-sm hover:text-ios-blue">
              شروط الاستخدام
            </Link>
            <Link href="/cookies" className="text-sm hover:text-ios-blue">
              سياسة ملفات الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 