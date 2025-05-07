import { Link } from "react-router";
import { useState, useEffect } from "react";
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';

/**
 * Header component with responsive navigation
 * Implements an Apple-like design with mobile menu support
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
          المكتبة التاريخية
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          <Link to="/" className="px-2 py-1 font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary dark:hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <Link to="/ages" className="px-2 py-1 font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary dark:hover:text-primary transition-colors">
            العصور
          </Link>
          <Link to="/categories" className="px-2 py-1 font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary dark:hover:text-primary transition-colors">
            التصنيفات
          </Link>
          <Link to="/documents" className="px-2 py-1 font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary dark:hover:text-primary transition-colors">
            الوثائق
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-800 dark:text-neutral-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <RiCloseLine size={24} />
          ) : (
            <RiMenu4Line size={24} />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full right-0 left-0 bg-white dark:bg-neutral-900 shadow-lg border-t border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link 
              to="/ages" 
              className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              العصور
            </Link>
            <Link 
              to="/categories" 
              className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              التصنيفات
            </Link>
            <Link 
              to="/documents" 
              className="py-2 px-4 text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              الوثائق
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 