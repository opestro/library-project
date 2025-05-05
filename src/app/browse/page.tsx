'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaFilter, FaChevronDown, FaTimes, FaDownload } from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';
import { documentsApi, historicalAgeApi, contentCategoryApi } from '@/lib/api';

// Define interfaces for our data
interface Document {
  id: string;
  title: string;
  description: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  age: string;
  category: string;
  author: string;
  publishDate: string;
  language: string;
  pageCount: number;
  thumbnailUrl: string;
  fileUrl: string;
  viewCount: number;
  downloadCount: number;
}

interface HistoricalAge {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  description: string;
}

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  parentId: string;
  isMain: boolean;
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  
  // States
  const [documents, setDocuments] = useState<Document[]>([]);
  const [ages, setAges] = useState<HistoricalAge[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedAge, setSelectedAge] = useState(searchParams.get('age') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createdDesc');
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch filter options
        const agesResult = await historicalAgeApi.getAll();
        const categoriesResult = await contentCategoryApi.getAll();
        
        if (agesResult.success && categoriesResult.success) {
          setAges(agesResult.data);
          setCategories(categoriesResult.data);
        }
        
        // Fetch documents with filters
        const filter = buildFilterObject();
        const result = await documentsApi.getFiltered(filter, page, itemsPerPage, sortBy);
        
        if (result.success) {
          setDocuments(result.data.items);
          setTotalPages(Math.ceil(result.data.totalItems / itemsPerPage));
        } else {
          setError(result.error || 'خطأ في استرجاع الوثائق');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [page, searchTerm, selectedAge, selectedCategory, sortBy]);
  
  // Build filter object for API call
  const buildFilterObject = () => {
    const filter: Record<string, string> = {};
    
    if (searchTerm) {
      filter.search = searchTerm;
    }
    
    if (selectedAge) {
      filter.age = selectedAge;
    }
    
    if (selectedCategory) {
      filter.category = selectedCategory;
    }
    
    return filter;
  };
  
  // Apply filters handler
  const applyFilters = () => {
    setPage(1);
    // Search params will be captured in the useEffect dependency array
  };
  
  // Clear filters handler
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAge('');
    setSelectedCategory('');
    setSortBy('createdDesc');
    setPage(1);
  };
  
  // Handle document click to increase view count
  const handleDocumentClick = async (documentId: string) => {
    await documentsApi.incrementViewCount(documentId);
  };
  
  // Handle document download
  const handleDocumentDownload = async (documentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await documentsApi.incrementDownloadCount(documentId);
    // Navigate to file URL or trigger download
    const doc = documents.find((d: Document) => d.id === documentId);
    if (doc && doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  };
  
  return (
    <MainLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              <span className="text-primary">مكتبة</span> الوثائق التاريخية
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              استكشف مجموعتنا الواسعة من الوثائق التاريخية المصنفة حسب العصور والأقسام المختلفة
            </p>
            
            {/* Search Bar */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaSearch className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن عنوان، مؤلف، أو كلمات مفتاحية..."
                  className="block w-full rounded-md border border-gray-300 bg-white p-3 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 md:w-auto"
              >
                <FaFilter />
                <span>الفلاتر</span>
                <FaChevronDown className={`transform transition-transform ${filtersVisible ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={() => applyFilters()}
                className="rounded-md bg-primary px-4 py-3 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:hover:bg-primary-dark"
              >
                بحث
              </button>
            </div>
            
            {/* Filters Panel */}
            {filtersVisible && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between">
                  <div className="mb-4 w-full sm:mb-0 sm:w-1/2 sm:pr-2 md:w-1/4">
                    <label htmlFor="age-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      العصر التاريخي
                    </label>
                    <select
                      id="age-filter"
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">جميع العصور</option>
                      {ages.map((age) => (
                        <option key={age.id} value={age.id}>
                          {age.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4 w-full sm:mb-0 sm:w-1/2 sm:pl-2 md:w-1/4 md:px-2">
                    <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      القسم
                    </label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">جميع الأقسام</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4 w-full sm:mb-0 sm:w-1/2 sm:pr-2 md:w-1/4 md:px-2">
                    <label htmlFor="sort-filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      ترتيب حسب
                    </label>
                    <select
                      id="sort-filter"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="createdDesc">الأحدث</option>
                      <option value="createdAsc">الأقدم</option>
                      <option value="titleAsc">العنوان (أ-ي)</option>
                      <option value="titleDesc">العنوان (ي-أ)</option>
                      <option value="viewCountDesc">الأكثر مشاهدة</option>
                      <option value="downloadCountDesc">الأكثر تحميلاً</option>
                    </select>
                  </div>
                  
                  <div className="flex w-full items-end sm:w-1/2 sm:pl-2 md:w-1/4">
                    <button
                      onClick={clearFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <FaTimes />
                      <span>إزالة الفلاتر</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
          
          {/* Document Grid */}
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 animate-spin text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-lg">جاري تحميل الوثائق...</p>
              </div>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {documents.map((document) => (
                <Link
                  href={`/document/${document.id}`}
                  key={document.id}
                  onClick={() => handleDocumentClick(document.id)}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {document.thumbnailUrl ? (
                      <img
                        src={document.thumbnailUrl}
                        alt={document.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <span className="text-xl text-gray-500 dark:text-gray-400">
                          لا توجد صورة
                        </span>
                      </div>
                    )}
                    {document.fileUrl && (
                      <button
                        onClick={(e) => handleDocumentDownload(document.id, e)}
                        className="absolute bottom-3 left-3 rounded-full bg-white p-2 text-primary shadow-md transition-transform hover:scale-110 dark:bg-gray-700 dark:text-blue-400"
                        aria-label="تحميل"
                      >
                        <FaDownload />
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-gray-900 dark:text-white">
                      {document.title}
                    </h3>
                    <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      <p className="mb-1">
                        <span className="font-medium">المؤلف: </span>
                        {document.author || 'غير معروف'}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">العصر: </span>
                        {ages.find(a => a.id === document.age)?.name || 'غير مصنف'}
                      </p>
                      <p>
                        <span className="font-medium">القسم: </span>
                        {categories.find(c => c.id === document.category)?.name || 'غير مصنف'}
                      </p>
                    </div>
                    <p className="line-clamp-3 min-h-[4.5rem] text-sm text-gray-600 dark:text-gray-400">
                      {document.description || 'لا يوجد وصف متاح لهذه الوثيقة.'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{document.viewCount} مشاهدة</span>
                      <span>{document.downloadCount} تحميل</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
                  لا توجد وثائق
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  لم يتم العثور على وثائق تطابق معايير البحث الخاصة بك.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    إزالة الفلاتر
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {documents.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  التالي
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Only show a few page numbers around the current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                          page === pageNumber
                            ? 'z-10 border-primary bg-primary-50 text-primary dark:border-primary-dark dark:bg-primary-dark/20 dark:text-primary-light'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show ellipsis when needed
                  if (
                    (pageNumber === 2 && page > 3) ||
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={`ellipsis-${pageNumber}`}
                        className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  السابق
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
} 