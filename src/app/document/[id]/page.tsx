'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaDownload, FaEye, FaCalendarAlt, FaUser, FaBookOpen, FaLanguage, FaShare, FaChevronLeft } from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';
import { documentsApi, documentMediaApi, historicalAgeApi, contentCategoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DocumentDetailPage() {
  // Get the document ID from the URL
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // States
  const [document, setDocument] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [age, setAge] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  
  // Related Documents
  const [relatedDocuments, setRelatedDocuments] = useState<any[]>([]);
  
  // Fetch document data
  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      setError('');
      
      try {
        // Get document details
        const docResult = await documentsApi.getById(id);
        
        if (!docResult.success || !docResult.data) {
          setError('الوثيقة غير موجودة');
          setIsLoading(false);
          return;
        }
        
        // Record view
        await documentsApi.incrementViewCount(id);
        
        const doc = docResult.data;
        setDocument(doc);
        
        // Set active image to thumbnail if available
        if (doc.thumbnailUrl) {
          setActiveImage(doc.thumbnailUrl);
        }
        
        // Fetch media files
        const mediaResult = await documentMediaApi.getByDocumentId(id);
        if (mediaResult.success && mediaResult.data) {
          setMedia(mediaResult.data);
          
          // If there are media files and no thumbnail is set, use the first media file
          if (mediaResult.data.length > 0 && !activeImage) {
            setActiveImage(mediaResult.data[0].url);
          }
        }
        
        // Fetch related information
        if (doc.age) {
          const ageResult = await historicalAgeApi.getById(doc.age);
          if (ageResult.success && ageResult.data) {
            setAge(ageResult.data);
          }
        }
        
        if (doc.category) {
          const categoryResult = await contentCategoryApi.getById(doc.category);
          if (categoryResult.success && categoryResult.data) {
            setCategory(categoryResult.data);
          }
        }
        
        // Fetch related documents
        let relatedDocsResult;
        if (doc.category) {
          relatedDocsResult = await documentsApi.getByCategory(doc.category, 4);
        } else if (doc.age) {
          relatedDocsResult = await documentsApi.getByHistoricalAge(doc.age, 4);
        }
        
        if (relatedDocsResult?.success && relatedDocsResult.data) {
          // Filter out the current document
          setRelatedDocuments(relatedDocsResult.data.filter((relDoc: any) => relDoc.id !== id));
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('حدث خطأ أثناء تحميل بيانات الوثيقة');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDocument();
  }, [id, activeImage]);
  
  // Handle document download
  const handleDownload = async () => {
    if (!document) return;
    
    try {
      await documentsApi.incrementDownloadCount(id);
      
      if (document.fileUrl) {
        window.open(document.fileUrl, '_blank');
        toast.success('جاري تحميل الملف');
      } else {
        toast.error('ملف التحميل غير متوفر');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('حدث خطأ أثناء التحميل');
    }
  };
  
  // Share document
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document?.title || 'وثيقة تاريخية',
        text: document?.description || 'مشاركة وثيقة من مكتبة الوثائق التاريخية',
        url: window.location.href,
      }).catch(err => {
        console.error('Share error:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط إلى الحافظة');
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
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
              <p className="mt-4 text-lg">جاري تحميل الوثيقة...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-red-800 dark:text-red-300">{error}</h2>
            <div className="mt-6">
              <button
                onClick={() => router.push('/browse')}
                className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
              >
                العودة إلى صفحة التصفح
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
          >
            <FaChevronLeft className="ml-1" />
            العودة
          </button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Document Images */}
          <div className="md:col-span-1">
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
              <div className="relative aspect-square">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={document?.title}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <span className="text-center text-lg text-gray-500 dark:text-gray-400">
                      لا توجد صورة
                    </span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {media.length > 0 && (
                <div className="flex gap-2 overflow-x-auto p-4">
                  {media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(item.url)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                        activeImage === item.url
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={`صورة ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  
                  {document?.thumbnailUrl && (
                    <button
                      onClick={() => setActiveImage(document.thumbnailUrl)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                        activeImage === document.thumbnailUrl
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={document.thumbnailUrl}
                        alt="صورة مصغرة"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex border-t border-gray-200 p-4 dark:border-gray-700">
                {document?.fileUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                  >
                    <FaDownload />
                    <span>تحميل</span>
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FaShare />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Document Details */}
          <div className="md:col-span-2">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {document?.title}
            </h1>
            
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              {document?.author && (
                <div className="flex items-center gap-1">
                  <FaUser className="text-gray-400" />
                  <span>المؤلف: {document.author}</span>
                </div>
              )}
              
              {document?.publishDate && (
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>تاريخ النشر: {document.publishDate}</span>
                </div>
              )}
              
              {document?.pageCount && (
                <div className="flex items-center gap-1">
                  <FaBookOpen className="text-gray-400" />
                  <span>عدد الصفحات: {document.pageCount}</span>
                </div>
              )}
              
              {document?.language && (
                <div className="flex items-center gap-1">
                  <FaLanguage className="text-gray-400" />
                  <span>اللغة: {document.language}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-400" />
                <span>المشاهدات: {document?.viewCount || 0}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FaDownload className="text-gray-400" />
                <span>التنزيلات: {document?.downloadCount || 0}</span>
              </div>
            </div>
            
            {/* Tags/Categories */}
            <div className="mb-6 flex flex-wrap gap-2">
              {age && (
                <Link
                  href={`/browse?age=${age.id}`}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {age.name}
                </Link>
              )}
              
              {category && (
                <Link
                  href={`/browse?category=${category.id}`}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  {category.name}
                </Link>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                وصف الوثيقة
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {document?.description || 'لا يوجد وصف متاح لهذه الوثيقة.'}
                </p>
              </div>
            </div>
            
            {/* Historical Context */}
            {age && (
              <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  السياق التاريخي: {age.name}
                </h2>
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300">
                    {age.description || `معلومات عن الفترة التاريخية ${age.name}.`}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    الفترة: {age.periodStart || '?'} - {age.periodEnd || '?'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Documents */}
        {relatedDocuments.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              وثائق ذات صلة
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedDocuments.map((doc) => (
                <Link
                  href={`/document/${doc.id}`}
                  key={doc.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {doc.thumbnailUrl ? (
                      <img
                        src={doc.thumbnailUrl}
                        alt={doc.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <span className="text-gray-500 dark:text-gray-400">
                          لا توجد صورة
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {doc.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {doc.description || 'لا يوجد وصف متاح لهذه الوثيقة.'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 