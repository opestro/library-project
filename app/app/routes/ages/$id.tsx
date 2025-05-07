import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import DocumentsSection from "../../components/sections/DocumentsSection";
import pb from "../../lib/pocketbase";
import type { Age } from "../../lib/pocketbase";

/**
 * Age detail page
 * Shows age information and related documents
 */
export default function AgeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [age, setAge] = useState<Age | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to handle request cancellation
    const abortController = new AbortController();

    const fetchAge = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("معرف العصر غير موجود");
        }

        // Pass the signal to PocketBase to handle cancellation properly
        const record = await pb.collection('ages').getOne(id, {
          $cancelKey: `age-${id}`,
        });
        
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          setAge(record as unknown as Age);
        }
      } catch (err) {
        console.error('Error fetching age:', err);
        
        // Only update error state if it's not a cancellation error and component is mounted
        if (!abortController.signal.aborted) {
          if (err instanceof Error) {
            if (err.message.includes('404')) {
              setError('لم يتم العثور على العصر المطلوب');
              // Redirect to ages list after 3 seconds
              setTimeout(() => navigate('/ages'), 3000);
            } else if (!err.message.includes('autocancelled')) {
              setError('حدث خطأ أثناء تحميل بيانات العصر التاريخي');
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

    fetchAge();

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
      // Also cancel any pending PocketBase requests with the same cancelKey
      pb.cancelRequest(`age-${id}`);
    };
  }, [id, navigate]);

  // Format the year range if available
  const yearRange = age && (
    age.start_year !== null && age.end_year !== null
      ? `${age.start_year} - ${age.end_year}`
      : age.start_year !== null
        ? `${age.start_year} وما بعده`
        : age.end_year !== null
          ? `حتى ${age.end_year}`
          : ''
  );

  // Get the image URL if available
  const imageUrl = age?.image 
    ? pb.files.getUrl(age, age.image) 
    : '/placeholder-age.jpg';

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mb-8"></div>
            <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !age) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || 'لم يتم العثور على العصر التاريخي'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              سيتم إعادة توجيهك إلى قائمة العصور...
            </p>
            <Link 
              to="/ages"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              العودة إلى قائمة العصور
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article>
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] bg-neutral-900">
          <img 
            src={imageUrl} 
            alt={age.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {age.name}
              </h1>
              {yearRange && (
                <div className="inline-block bg-primary/90 text-white px-4 py-2 rounded-lg text-lg font-medium">
                  {yearRange}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          {age.description && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-3xl mx-auto mb-16"
              dangerouslySetInnerHTML={{ __html: age.description }}
            />
          )}
        </div>

        {/* Documents Section */}
        <DocumentsSection 
          title="وثائق هذا العصر"
          ageId={age.id}
          limit={12}
          showViewAll={false}
        />
      </article>
    </Layout>
  );
} 