"use client";
/**
 * Hero.tsx
 * 
 * iOS-style hero section component for the Digital Historical Library.
 * Features gradient background, search functionality, and statistics.
 * Now with dynamic data loading from PocketBase.
 */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentCategoryAPI, HistoricalAgeAPI } from '@/lib/api';
import { ContentCategory, HistoricalAge } from '@/types';

interface HeroProps {
  /**
   * Additional class names for the hero container
   */
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ages, setAges] = useState<HistoricalAge[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load ages and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch ages
        const ageApi = new HistoricalAgeAPI();
        const agesResponse = await ageApi.getAll();
        if (agesResponse.success && agesResponse.data) {
          setAges(agesResponse.data);
        }

        // Fetch categories
        const categoryApi = new ContentCategoryAPI();
        const categoriesResponse = await categoryApi.getAll();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedAge) params.append('age', selectedAge);
    if (selectedCategory) params.append('category', selectedCategory);
    
    // Navigate to browse page with filters
    router.push(`/browse?${params.toString()}`);
  };

  // Stats data - could be fetched from an API in a real implementation
  const stats = [
    { icon: 'scroll', value: '١٠,٠٠٠+', label: 'وثيقة تاريخية' },
    { icon: 'book', value: '٥٠+', label: 'مجموعة نادرة' },
    { icon: 'language', value: '٨ لغات', label: 'متاحة للترجمة' }
  ];

  return (
    <section className={cn('hero', className)} aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-content fade-in">
          <div className="hero-text">
            <h1 id="hero-title">المكتبة التاريخية الرقمية</h1>
            <p className="hero-description">
              استكشف مجموعتنا الفريدة من الوثائق التاريخية المصنفة حسب العصور المختلفة، 
              مع قاعدة بيانات غنية ومتنوعة من المخطوطات والمستندات النادرة
            </p>
          </div>
          
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-group">
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="ابحث عن وثائق تاريخية..." 
                  aria-label="ابحث عن وثائق تاريخية"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
              
              <div className="search-filters">
                <div className="filter-group">
                  <i className="fas fa-history"></i>
                  <select 
                    className="search-filter" 
                    aria-label="اختر العصر التاريخي"
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">العصر التاريخي</option>
                    {ages.map((age) => (
                      <option key={age.id} value={age.id}>
                        {age.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <i className="fas fa-file-alt"></i>
                  <select 
                    className="search-filter" 
                    aria-label="اختر نوع الوثيقة"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">نوع الوثيقة</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
            
            <div className="search-suggestions">
              <span className="suggestions-label">اقتراحات البحث:</span>
              <div className="suggestions-tags">
                <a href="#" onClick={(e) => {e.preventDefault(); setSearchQuery('المعاهدات التاريخية'); }} className="suggestion-tag">المعاهدات التاريخية</a>
                <a href="#" onClick={(e) => {e.preventDefault(); setSearchQuery('مخطوطات نادرة'); }} className="suggestion-tag">مخطوطات نادرة</a>
                <a href="#" onClick={(e) => {e.preventDefault(); setSearchQuery('وثائق العصر العباسي'); }} className="suggestion-tag">وثائق العصر العباسي</a>
              </div>
            </div>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <i className={`fas fa-${stat.icon}`}></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-shape"></div>
    </section>
  );
} 