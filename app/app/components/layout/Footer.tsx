import { Link } from "react-router";
import { RiHeartFill, RiTwitterXFill, RiFacebookFill, RiInstagramFill } from 'react-icons/ri';

/**
 * Footer component with navigation links and social media icons
 * Follows the Apple-like design system
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Site Info */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary">
              المكتبة التاريخية
            </Link>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              نقدم لكم مجموعة متنوعة من الوثائق التاريخية في مختلف العصور والمجالات، مع التركيز على دقة المعلومات وسهولة الوصول إليها.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse mt-6">
              <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                <RiTwitterXFill size={20} />
              </a>
              <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                <RiFacebookFill size={20} />
              </a>
              <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                <RiInstagramFill size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/ages" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                  العصور
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors">
                  الوثائق
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              تواصل معنا
            </h3>
            <address className="not-italic text-neutral-600 dark:text-neutral-400">
              <p className="mb-2">البريد الإلكتروني: <a href="mailto:info@historical-library.com" className="hover:text-primary transition-colors">info@historical-library.com</a></p>
              <p className="mb-2">الهاتف: +123 456 7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            © {currentYear} المكتبة التاريخية. جميع الحقوق محفوظة.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-4 md:mt-0 flex items-center">
            صُنع بـ <RiHeartFill className="text-red-500 mx-1" /> في الجزائر  
          </p>
        </div>
      </div>
    </footer>
  );
} 