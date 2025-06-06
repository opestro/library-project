import { Link } from "react-router";
import { useState, useEffect } from "react";
import DocumentCard from "../ui/DocumentCard";
import pb from "../../lib/pocketbase";
import type { Document } from "../../lib/pocketbase";

/**
 * Section component for displaying a grid of documents
 * Used on the home page and can be reused elsewhere
 * 
 * @param limit - Optional limit of items to display
 * @param showViewAll - Whether to show the "View All" link
 * @param title - Optional custom title for the section
 * @param filter - Optional PocketBase filter string
 * @param categoryId - Optional category ID to filter by
 * @param ageId - Optional age ID to filter by
 * @param cancelKey - Optional unique identifier for cancellation
 */
interface DocumentsSectionProps {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  filter?: string;
  categoryId?: string;
  ageId?: string;
  cancelKey?: string;
}

export default function DocumentsSection({ 
  limit = 6, 
  showViewAll = true,
  title = "أحدث الوثائق",
  filter,
  categoryId,
  ageId,
  cancelKey = "documents-section"
}: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to handle request cancellation
    const abortController = new AbortController();
    
    // Create a unique cancelKey for this specific section instance
    const uniqueCancelKey = `${cancelKey}-${categoryId || ''}-${ageId || ''}-${limit}`;

    // Fetch documents from PocketBase
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        // Build the filter string based on props
        let filterString = filter || '';
        
        if (categoryId) {
          filterString = filterString ? `${filterString} && category = "${categoryId}"` : `category = "${categoryId}"`;
        }
        
        if (ageId) {
          filterString = filterString ? `${filterString} && age = "${ageId}"` : `age = "${ageId}"`;
        }
        
        // Add filter for published documents only if no other filter is provided
        if (!filterString) {
          filterString = 'published_at != null';
        }
        
        const response = await pb.collection('documents').getList(1, limit, {
          sort: '-published_at',
          filter: filterString,
          expand: 'author,category,age',
          $cancelKey: uniqueCancelKey,
        });
        
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          // Cast to unknown first to avoid TypeScript error
          setDocuments(response.items as unknown as Document[]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        
        // Only update error state if it's not a cancellation error and component is mounted
        if (!abortController.signal.aborted && err instanceof Error && !err.message.includes('autocancelled')) {
          setError('حدث خطأ أثناء تحميل الوثائق');
        }
      } finally {
        // Only update loading state if the component is still mounted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
    
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
      // Also cancel any pending PocketBase requests with the same cancelKey
      pb.cancelRequest(uniqueCancelKey);
    };
  }, [limit, filter, categoryId, ageId, cancelKey]);
  
  // Determine the "View All" link URL based on context
  const getViewAllUrl = () => {
    if (categoryId) {
      return `/categories/${categoryId}`;
    }
    if (ageId) {
      return `/ages/${ageId}`;
    }
    return '/documents';
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h2>
          
          {showViewAll && (
            <Link 
              to={getViewAllUrl()} 
              className="text-primary hover:text-primary-dark font-medium flex items-center transition-colors"
            >
              عرض الكل
              <span className="mr-1 rtl:rotate-180">&rarr;</span>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
              <div 
                key={index} 
                className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-72 animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            {error}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            لا توجد وثائق لعرضها
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 