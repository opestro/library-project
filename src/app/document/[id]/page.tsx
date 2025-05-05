/**
 * Document Detail Page
 * 
 * Displays detailed information about a single historical document.
 * Uses iOS-style design and fetches real data from PocketBase.
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DocumentCard } from '@/components/shared/DocumentCard';
import { FaArrowRight, FaBookmark, FaDownload, FaEye, FaShare, FaRegBookmark, FaCalendarAlt, FaUser, FaTag, FaHistory, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { DocumentsAPI, ContentCategoryAPI, HistoricalAgeAPI } from '@/lib/api';
import { getPocketBase } from '@/lib/pocketbase';
import { HistoricalDocument, HistoricalAge, ContentCategory } from '@/types';

// Define badge variants to fix type error
type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning' | 'info';

// Extended document interface with additional properties
interface UIDocument extends HistoricalDocument {
  // Media files related to the document
  expand?: {
    author?: any;
    age?: HistoricalAge;
    category?: ContentCategory;
    media?: Array<{ 
      id: string;
      file: string;
      file_type: string;
      title?: string;
      description?: string;
    }>;
  };
  // Additional properties that might be returned by API but not in base type
  page_count?: number;
  is_premium?: boolean;
}

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams() || {};
  const paramId = params.id;
  const documentId = typeof paramId === 'string' ? paramId : 
                   Array.isArray(paramId) ? paramId[0] : '';
  
  // States
  const [document, setDocument] = useState<UIDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedDocs, setRelatedDocs] = useState<UIDocument[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [ages, setAges] = useState<HistoricalAge[]>([]);
  
  // Fetch document data
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (!documentId) return;
      
      setIsLoading(true);
      try {
        // Fetch document details
        const documentsApi = new DocumentsAPI();
        const response = await documentsApi.getById(documentId);
        
        if (response.success && response.data) {
          const doc = response.data as UIDocument;
          setDocument(doc);
          
          // Increment view count
          await documentsApi.incrementViewCount(documentId);
          
          // Fetch related documents
          const relatedResponse = await documentsApi.getByCategory(
            doc.category || '',
            4
          );
          
          if (relatedResponse.success && relatedResponse.data) {
            // Filter out the current document from related docs
            const filtered = relatedResponse.data.filter(
              (d) => d.id !== documentId
            );
            setRelatedDocs(filtered as UIDocument[]);
          }
        } else {
          setError('لم يتم العثور على الوثيقة');
        }
        
        // Fetch categories
        const categoryApi = new ContentCategoryAPI();
        const categoriesResponse = await categoryApi.getAll();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch ages
        const ageApi = new HistoricalAgeAPI();
        const agesResponse = await ageApi.getAll();
        if (agesResponse.success && agesResponse.data) {
          setAges(agesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('حدث خطأ أثناء تحميل بيانات الوثيقة');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocumentData();
  }, [documentId]);
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app with authentication, would make an API call to update user's bookmarks
  };
  
  // Handle document download
  const handleDownload = async () => {
    if (!document) return;
    
    try {
      // Get main document file if available
      const fileUrl = document.expand?.media?.[currentPage]?.file;
      const mediaItem = document.expand?.media?.[currentPage];
      
      if (fileUrl && mediaItem) {
        // In a real app with authentication, might need to include auth token
        const pb = getPocketBase();
        const fullUrl = pb.getFileUrl(mediaItem, fileUrl);
        
        // Create a temporary anchor and trigger download
        const a = window.document.createElement('a');
        a.href = fullUrl;
        a.download = `${document.title}.pdf`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        
        // Increment download count
        const documentsApi = new DocumentsAPI();
        await documentsApi.incrementDownloadCount(documentId);
      } else {
        console.error('No file available for download');
        alert('الملف غير متوفر للتنزيل');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('حدث خطأ أثناء تنزيل الوثيقة');
    }
  };
  
  // Handle sharing
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share && document) {
      navigator.share({
        title: document.title,
        text: document.summary || 'وثيقة تاريخية من المكتبة الرقمية',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback copy to clipboard
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط إلى الحافظة');
      }
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="h-12 w-12 text-[#007AFF] animate-spin" />
              <p className="text-lg text-[#8E8E93] dark:text-gray-400">جاري تحميل بيانات الوثيقة...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Error or document not found
  if (error || !document) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-6 rounded-full bg-[#F2F2F7] dark:bg-gray-700 p-8 inline-block">
              <FaFileAlt className="h-12 w-12 text-[#8E8E93] dark:text-gray-400" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-[#1C1C1E] dark:text-white">
              {error || 'لم يتم العثور على الوثيقة'}
            </h1>
            <p className="mb-6 text-[#8E8E93] dark:text-gray-400">
              الوثيقة التي تبحث عنها غير موجودة أو تم حذفها
            </p>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FaArrowRight />}
              onClick={() => router.push('/browse')}
            >
              العودة إلى صفحة التصفح
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Find category and age names
  const categoryName = categories.find(c => c.id === document.category)?.name || '';
  const eraName = ages.find(a => a.id === document.age)?.name || '';
  
  // Get document media
  const documentMedia = document.expand?.media || [];
  const hasMedia = documentMedia.length > 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/browse')}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#007AFF] dark:text-blue-400"
          >
            <FaArrowRight className="h-3 w-3" />
            <span>العودة إلى صفحة التصفح</span>
          </button>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Document image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[3/4] bg-[#F2F2F7] dark:bg-gray-700">
                {hasMedia && documentMedia[currentPage] ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={getPocketBase().getFileUrl(documentMedia[currentPage], documentMedia[currentPage].file)}
                      alt={documentMedia[currentPage].title || `صفحة ${currentPage + 1} من ${document.title}`}
                      className="object-contain"
                      fill
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <FaFileAlt className="mx-auto h-16 w-16 text-[#8E8E93] dark:text-gray-400" />
                      <p className="mt-4 text-[#8E8E93] dark:text-gray-400">لا توجد صورة متوفرة</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Page navigation */}
              {hasMedia && documentMedia.length > 1 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8E8E93] dark:text-gray-400">
                      الصفحة {currentPage + 1} من {documentMedia.length}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                      >
                        السابق
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(documentMedia.length - 1, p + 1))}
                        disabled={currentPage === documentMedia.length - 1}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {documentMedia.map((page, index) => (
                      <button
                        key={page.id}
                        onClick={() => setCurrentPage(index)}
                        className={`relative min-w-[60px] aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${
                          currentPage === index
                            ? 'border-[#007AFF]'
                            : 'border-transparent hover:border-[#007AFF]/50'
                        }`}
                      >
                        <Image
                          src={getPocketBase().getFileUrl(page, page.file, {'thumb': '100x100'})}
                          alt={`صفحة ${index + 1}`}
                          className="object-cover"
                          fill
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Document info */}
            <div className="lg:col-span-7">
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1C1C1E] dark:text-white">
                      {document.title}
                    </h1>
                    
                    <button
                      onClick={handleBookmarkToggle}
                      className={`p-2 rounded-full ${
                        isBookmarked
                          ? 'text-[#FF9500] hover:text-[#FF8000]'
                          : 'text-[#8E8E93] hover:text-[#007AFF]'
                      }`}
                      aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'إضافة إلى المحفوظات'}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="h-5 w-5" />
                      ) : (
                        <FaRegBookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Document badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categoryName && (
                      <Badge variant="info" size="md">
                        <FaTag className="ml-1 h-3 w-3" />
                        {categoryName}
                      </Badge>
                    )}
                    
                    {eraName && (
                      <Badge variant="secondary" size="md">
                        <FaHistory className="ml-1 h-3 w-3" />
                        {eraName}
                      </Badge>
                    )}
                    
                    {document.published_at && (
                      <Badge variant="secondary" size="md">
                        <FaCalendarAlt className="ml-1 h-3 w-3" />
                        {new Date(document.published_at).toLocaleDateString('ar-SA')}
                      </Badge>
                    )}
                    
                    {document.is_premium && (
                      <Badge variant="warning" size="md">
                        حصري
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Document stats */}
                <div className="flex flex-wrap gap-4 text-sm text-[#8E8E93] dark:text-gray-400">
                  {document.view_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <FaEye className="h-4 w-4" />
                      <span>{document.view_count} مشاهدة</span>
                    </div>
                  )}
                  
                  {document.page_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <FaFileAlt className="h-4 w-4" />
                      <span>{document.page_count} صفحة</span>
                    </div>
                  )}
                  
                  {document.expand?.author && (
                    <div className="flex items-center gap-1">
                      <FaUser className="h-4 w-4" />
                      <span>{document.expand.author.name || 'غير معروف'}</span>
                    </div>
                  )}
                </div>
                
                {/* Document actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<FaDownload className="h-4 w-4" />}
                    onClick={handleDownload}
                    disabled={!hasMedia}
                  >
                    تنزيل
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<FaShare className="h-4 w-4" />}
                    onClick={handleShare}
                  >
                    مشاركة
                  </Button>
                </div>
                
                {/* Document summary */}
                {document.summary && (
                  <div>
                    <h2 className="mb-2 text-xl font-semibold text-[#1C1C1E] dark:text-white">
                      نبذة عن الوثيقة
                    </h2>
                    <p className="text-[#3C3C43] dark:text-gray-300">
                      {document.summary}
                    </p>
                  </div>
                )}
                
                {/* Document content */}
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-[#1C1C1E] dark:text-white">
                    محتوى الوثيقة
                  </h2>
                  <Card className="p-6 border border-[#E5E5EA] dark:border-gray-700">
                    <div 
                      className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[#1C1C1E] prose-p:text-[#3C3C43] prose-a:text-[#007AFF]"
                      dangerouslySetInnerHTML={{ __html: document.content }}
                    />
                  </Card>
                </div>
                
                {/* Document metadata */}
                {document.expand?.author && (
                  <div>
                    <h2 className="mb-2 text-xl font-semibold text-[#1C1C1E] dark:text-white">
                      معلومات المؤلف
                    </h2>
                    <Card className="p-6 border border-[#E5E5EA] dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <Avatar 
                          size="lg"
                          src={document.expand.author.avatar ? getPocketBase().getFileUrl(document.expand.author, document.expand.author.avatar) : ''}
                          alt={document.expand.author.name || ''}
                        />
                        <div>
                          <h3 className="text-lg font-medium text-[#1C1C1E] dark:text-white">
                            {document.expand.author.name || 'غير معروف'}
                          </h3>
                          {document.expand.author.email && (
                            <p className="text-sm text-[#8E8E93] dark:text-gray-400">
                              {document.expand.author.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related documents */}
        {relatedDocs.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-[#1C1C1E] dark:text-white">
              وثائق مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDocs.map((doc) => {
                // Find category and era names for related docs
                const docCategoryName = categories.find(c => c.id === doc.category)?.name || '';
                const docEraName = ages.find(a => a.id === doc.age)?.name || '';
                const mediaItem = doc.expand?.media?.[0];
                const imageUrl = mediaItem && mediaItem.file 
                  ? getPocketBase().getFileUrl(mediaItem, mediaItem.file)
                  : '';
                
                return (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    description={doc.summary || doc.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    imageUrl={imageUrl}
                    date={doc.published_at || doc.created}
                    category={docCategoryName}
                    era={docEraName}
                    pageCount={doc.page_count}
                    viewCount={doc.view_count}
                    isPremium={doc.is_premium}
                    variant="vertical"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 