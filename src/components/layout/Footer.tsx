/**
 * Footer.tsx
 * 
 * A reusable footer component that follows iOS design principles.
 * Includes navigation links, social media, and copyright information.
 */
import React from 'react';
import Link from 'next/link';
import { FaBookOpen, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Footer link groups
  const linkGroups = [
    {
      title: 'روابط سريعة',
      links: [
        { label: 'الرئيسية', href: '/' },
        { label: 'تصفح الوثائق', href: '/browse' },
        { label: 'طلب وثائق', href: '/request' },
        { label: 'اتصل بنا', href: '/contact' },
      ],
    },
    {
      title: 'العصور التاريخية',
      links: [
        { label: 'العصر القديم', href: '/browse?age=1' },
        { label: 'العصر الوسيط', href: '/browse?age=2' },
        { label: 'العصر الحديث', href: '/browse?age=3' },
        { label: 'العصر المعاصر', href: '/browse?age=4' },
      ],
    },
    {
      title: 'معلومات قانونية',
      links: [
        { label: 'شروط الاستخدام', href: '/terms' },
        { label: 'سياسة الخصوصية', href: '/privacy' },
        { label: 'حقوق الملكية', href: '/rights' },
        { label: 'عن المكتبة', href: '/about' },
      ],
    },
  ];
  
  // Social media links
  const socialLinks = [
    { icon: <FaTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaFacebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaInstagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaYoutube />, href: 'https://youtube.com', label: 'YouTube' },
  ];
  
  // Contact information
  const contactInfo = [
    { icon: <FaEnvelope />, label: 'البريد الإلكتروني', value: 'info@historicallibrary.org' },
    { icon: <FaPhoneAlt />, label: 'الهاتف', value: '+966 123 456 789' },
    { icon: <FaMapMarkerAlt />, label: 'العنوان', value: 'الرياض، المملكة العربية السعودية' },
  ];
  
  return (
    <footer className="bg-[#F2F2F7] dark:bg-gray-900 border-t border-[#E5E5EA] dark:border-gray-800">
      <div className="container mx-auto px-4 py-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand and contact */}
          <div>
            <div className="mb-4">
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse text-xl font-bold text-[#007AFF]">
                <FaBookOpen className="ml-2 h-6 w-6" />
                <span>المكتبة التاريخية</span>
              </Link>
              <p className="mt-3 text-sm text-[#8E8E93] dark:text-gray-400">
                المكتبة التاريخية الرقمية هي مشروع يهدف إلى توثيق وحماية الوثائق التاريخية وعرضها بشكل رقمي مع ضمان أمانها وأصالتها.
              </p>
            </div>
            
            {/* Contact information */}
            <div className="mt-6">
              <h3 className="text-base font-semibold mb-3 text-[#1C1C1E] dark:text-white">اتصل بنا</h3>
              <ul className="space-y-2">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-[#8E8E93] dark:text-gray-400">
                    <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-[#007AFF]">
                      {item.icon}
                    </span>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Link groups */}
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-base font-semibold mb-4 text-[#1C1C1E] dark:text-white">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-[#8E8E93] hover:text-[#007AFF] dark:text-gray-400 dark:hover:text-[#007AFF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom footer with social and copyright */}
        <div className="mt-10 pt-6 border-t border-[#E5E5EA] dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social media links */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:bg-[#007AFF] hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-[#007AFF] dark:hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Copyright */}
            <div className="text-sm text-[#8E8E93] dark:text-gray-400">
              &copy; {currentYear} المكتبة التاريخية الرقمية. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 