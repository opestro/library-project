/**
 * Browse Page
 * 
 * Displays a collection of historical documents with search and filtering capabilities.
 * Uses iOS-style design with our custom components and PocketBase data.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentCard } from '@/components/shared/DocumentCard';
import { SearchFilters } from '@/components/shared/SearchFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FaChevronLeft, FaChevronRight, FaDownload, FaEye } from 'react-icons/fa';
import { DocumentsAPI, ContentCategoryAPI, HistoricalAgeAPI } from '@/lib/api';
import { HistoricalDocument, ContentCategory, HistoricalAge } from '@/types';

// Define sort options as a type
type SortOption = 'newest' | 'oldest' | 'popular' | 'relevant';

// Extended document interface with additional properties used in UI
interface UIDocument extends HistoricalDocument {
  // Media files related to the document
  expand?: {
    author?: any;
    age?: HistoricalAge;
    category?: ContentCategory;
    media?: Array<{ file: string }>; // For document images
  };
  // Additional properties that might be returned by API but not in base type
  page_count?: number;
  is_premium?: boolean;
}

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for documents and loading
  const [documents, setDocuments] = useState<UIDocument[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [ages, setAges] = useState<HistoricalAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  // Parse the query parameters (with null checks)
  const initialSearch = searchParams?.get('query') || '';
  const initialAge = searchParams?.get('age') || undefined;
  const initialCategory = searchParams?.get('category') || undefined;
  
  // State for filters
  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory as string | undefined,
    age: initialAge as string | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    onlyFree: false,
    sortBy: 'newest' as SortOption,
  });
  
  // State for layout
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  // Fetch categories and ages on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch categories
        const categoryApi = new ContentCategoryAPI();
        const categoriesResponse = await categoryApi.getAll();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch historical ages
        const ageApi = new HistoricalAgeAPI();
        const agesResponse = await ageApi.getAll();
        if (agesResponse.success && agesResponse.data) {
          setAges(agesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    
    fetchMetadata();
  }, []);
  
  // Fetch documents when filters change
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const documentsApi = new DocumentsAPI();
        
        // Convert filters to format expected by API
        const apiFilters: Record<string, string> = {};
        if (filters.search) apiFilters.search = filters.search;
        if (filters.category) apiFilters.category = filters.category;
        if (filters.age) apiFilters.age = filters.age;
        if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom;
        if (filters.dateTo) apiFilters.dateTo = filters.dateTo;
        
        // Map sort options to API sort options
        let sortBy = '';
        switch (filters.sortBy) {
          case 'newest':
            sortBy = 'createdDesc';
            break;
          case 'oldest':
            sortBy = 'createdAsc';
            break;
          case 'popular':
            sortBy = 'viewCountDesc';
            break;
          case 'relevant':
          default:
            sortBy = 'createdDesc';
        }
        
        // Fetch filtered documents
        const response = await documentsApi.getFiltered(
          apiFilters,
          currentPage,
          perPage,
          sortBy
        );
        
        if (response.success && response.data) {
          setDocuments(response.data.items as UIDocument[]);
          setTotalDocuments(response.data.totalItems);
          setTotalPages(response.data.totalPages);
        } else {
          setDocuments([]);
          setTotalDocuments(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [filters, currentPage]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append('query', filters.search);
    if (filters.age) params.append('age', filters.age);
    if (filters.category) params.append('category', filters.category);
    
    const url = `/browse?${params.toString()}`;
    router.replace(url, { scroll: false });
  }, [filters, router]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(newFilters);
  };

  // Toggle bookmark
  const handleBookmark = async (id: string) => {
    // In a real implementation, you would call the API to toggle bookmark
    console.log(`Toggling bookmark for document ${id}`);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Display loading state
  if (isLoading && documents.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-t-[#007AFF] border-r-[#007AFF]/30 border-b-[#007AFF]/30 border-l-[#007AFF]/30 rounded-full animate-spin"></div>
                <p className="text-lg text-[#8E8E93] dark:text-gray-400">جاري تحميل الوثائق...</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1C1C1E] dark:text-white">
                استكشاف الوثائق التاريخية
              </h1>
              <p className="mt-2 text-[#8E8E93] dark:text-gray-400">
                اكتشف مجموعتنا الواسعة من الوثائق والمخطوطات التاريخية النادرة
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={layout === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setLayout('grid')}
                aria-label="عرض شبكي"
                className="px-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
              <Button
                variant={layout === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setLayout('list')}
                aria-label="عرض قائمة"
                className="px-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Filters section */}
          <Card className="p-4 border border-[#E5E5EA] dark:border-gray-700 bg-white dark:bg-gray-800">
            <SearchFilters
              filters={filters}
              onChange={handleFilterChange}
              categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
              eras={ages.map(age => ({ id: age.id, name: age.name }))}
            />
          </Card>
          
          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#8E8E93] dark:text-gray-400">
              تم العثور على <span className="font-medium text-[#1C1C1E] dark:text-white">{totalDocuments}</span> وثيقة
            </p>
            
            {filters.search && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#8E8E93] dark:text-gray-400">نتائج البحث عن:</span>
                <Badge variant="secondary" size="sm">{filters.search}</Badge>
              </div>
            )}
          </div>
          
          {/* Documents grid/list */}
          {documents.length > 0 ? (
            <div className={`grid gap-6 ${
              layout === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {documents.map((doc) => {
                // Find the category and era names
                const categoryName = categories.find(c => c.id === doc.category)?.name || '';
                const eraName = ages.find(a => a.id === doc.age)?.name || '';
                
                // Extract the image URL from expand media if available
                const imageUrl = doc.expand?.media?.[0]?.file || '';
                
                return (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    description={doc.summary || doc.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    imageUrl={imageUrl}
                    date={doc.published_at || doc.created}
                    category={categoryName}
                    era={eraName}
                    pageCount={doc.page_count}
                    viewCount={doc.view_count}
                    isPremium={doc.is_premium}
                    onBookmark={() => handleBookmark(doc.id)}
                    variant={layout === 'grid' ? 'vertical' : 'horizontal'}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center border border-[#E5E5EA] dark:border-gray-700">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#F2F2F7] dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8E8E93] dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1C1C1E] dark:text-white">لم يتم العثور على نتائج</h3>
                <p className="text-[#8E8E93] dark:text-gray-400 max-w-md">
                  لم نتمكن من العثور على أي وثائق تطابق معايير البحث. حاول تعديل الفلاتر أو استخدام كلمات بحث مختلفة.
                </p>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => handleFilterChange({
                    search: '',
                    category: undefined,
                    age: undefined,
                    dateFrom: undefined,
                    dateTo: undefined,
                    onlyFree: false,
                    sortBy: 'newest' as SortOption,
                  })}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </Card>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FaChevronRight />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNumber: number;
                    
                    // Calculate page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else {
                      if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? 'primary' : 'ghost'}
                        size="sm"
                        className={`min-w-[40px] ${pageNumber === currentPage ? '' : 'text-[#8E8E93]'}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<FaChevronLeft />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 