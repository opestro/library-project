import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import DocumentsSection from "../../components/sections/DocumentsSection";
import pb from "../../lib/pocketbase";
import type { Category } from "../../lib/pocketbase";

/**
 * Category detail page
 * Shows category information and related documents
 */
export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentCount, setDocumentCount] = useState<number>(0);

  useEffect(() => {
    // Create an AbortController to handle request cancellation
    const abortController = new AbortController();

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("معرف التصنيف غير موجود");
        }

        // Pass the cancelKey to PocketBase to handle cancellation properly
        const record = await pb.collection('categories').getOne(id, {
          $cancelKey: `category-${id}`,
        });
        
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          setCategory(record as unknown as Category);
          
          // Get document count for this category
          const docsCount = await pb.collection('documents').getList(1, 1, {
            filter: `category = "${id}"`,
            $cancelKey: `category-docs-${id}`,
          });
          
          if (!abortController.signal.aborted) {
            setDocumentCount(docsCount.totalItems);
          }
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        
        // Only update error state if it's not a cancellation error and component is mounted
        if (!abortController.signal.aborted) {
          if (err instanceof Error) {
            if (err.message.includes('404')) {
              setError('لم يتم العثور على التصنيف المطلوب');
              // Redirect to categories list after 3 seconds
              setTimeout(() => navigate('/categories'), 3000);
            } else if (!err.message.includes('autocancelled')) {
              setError('حدث خطأ أثناء تحميل بيانات التصنيف');
            }
          }
        }
      } finally {
        // Only update loading state if the component is still mounted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategory();

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
      // Also cancel any pending PocketBase requests with the same cancelKey
      pb.cancelRequest(`category-${id}`);
      pb.cancelRequest(`category-docs-${id}`);
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || 'لم يتم العثور على التصنيف'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              سيتم إعادة توجيهك إلى قائمة التصنيفات...
            </p>
            <Link 
              to="/categories"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              العودة إلى قائمة التصنيفات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article>
        {/* Header Section */}
        <div className="bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-neutral-950 pt-12 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                {category.name}
              </h1>
              
              {category.description && (
                <div 
                  className="prose prose-lg dark:prose-invert mb-6"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              )}
              
              <div className="text-lg text-neutral-600 dark:text-neutral-400">
                {documentCount} {documentCount === 1 ? 'وثيقة' : documentCount >= 2 && documentCount <= 10 ? 'وثائق' : 'وثيقة'}
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <DocumentsSection 
          title="الوثائق في هذا التصنيف"
          categoryId={category.id}
          limit={12}
          showViewAll={false}
        />
      </article>
    </Layout>
  );
} 