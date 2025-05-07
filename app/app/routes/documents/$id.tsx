import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { RiTimeLine, RiEyeLine, RiUser3Line } from 'react-icons/ri';
import Layout from "../../components/layout/Layout";
import MediaPlayer from "../../components/ui/MediaPlayer";
import pb from "../../lib/pocketbase";
import type { Document, Age, Category } from "../../lib/pocketbase";

/**
 * Document detail page
 * Shows detailed information about a historical document
 */
export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [age, setAge] = useState<Age | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    // Create an AbortController to handle request cancellation
    const abortController = new AbortController();

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("معرف الوثيقة غير موجود");
        }

        // Pass the cancelKey to PocketBase to handle cancellation properly
        const record = await pb.collection('documents').getOne(id, {
          expand: 'age,category,author',
          $cancelKey: `document-${id}`,
        });
        
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          setDocument(record as unknown as Document);
          
          if (record.expand?.age) {
            setAge(record.expand.age as unknown as Age);
          }
          
          if (record.expand?.category) {
            setCategory(record.expand.category as unknown as Category);
          }
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        
        // Only update error state if it's not a cancellation error and component is mounted
        if (!abortController.signal.aborted) {
          if (err instanceof Error) {
            if (err.message.includes('404')) {
              setError('لم يتم العثور على الوثيقة المطلوبة');
              // Redirect to documents list after 3 seconds
              setTimeout(() => navigate('/documents'), 3000);
            } else if (!err.message.includes('autocancelled')) {
              setError('حدث خطأ أثناء تحميل بيانات الوثيقة');
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

    fetchDocument();

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
      // Also cancel any pending PocketBase requests with the same cancelKey
      pb.cancelRequest(`document-${id}`);
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-8"></div>
            <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !document) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || 'لم يتم العثور على الوثيقة'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              سيتم إعادة توجيهك إلى قائمة الوثائق...
            </p>
            <Link 
              to="/documents"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              العودة إلى قائمة الوثائق
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="min-h-screen bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-neutral-950">
        {/* Document Header */}
        <header className="pt-12 pb-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              {age && (
                <Link 
                  to={`/ages/${age.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <span className="sr-only">العصر:</span>
                  {age.name}
                </Link>
              )}
              
              {category && (
                <Link 
                  to={`/categories/${category.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <span className="sr-only">التصنيف:</span>
                  {category.name}
                </Link>
              )}
            </div>

            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              {document.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              {document.published_at && (
                <div className="flex items-center gap-2">
                  <RiTimeLine className="text-primary" />
                  <time dateTime={document.published_at}>
                    {new Date(document.published_at).toLocaleDateString('ar-SA')}
                  </time>
                </div>
              )}

              {document.view_count !== undefined && (
                <div className="flex items-center gap-2">
                  <RiEyeLine className="text-primary" />
                  <span>{document.view_count} مشاهدة</span>
                </div>
              )}

              {document.expand?.author && (
                <div className="flex items-center gap-2">
                  <RiUser3Line className="text-primary" />
                  <span>{document.expand.author.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Document Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Media Section */}
            <div className="space-y-8 mb-12">
              {/* Main Image */}
              {document.image && (
                <div className="aspect-[21/9] overflow-hidden rounded-2xl">
                  <img
                    src={pb.files.getUrl(document, document.image)}
                    alt={document.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Video Player */}
              {document.video && (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <MediaPlayer 
                    document={document} 
                    type="video" 
                  />
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8">
              {document.description && (
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: document.description }}
                />
              )}
              
              {document.content && (
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Fixed Audio Player */}
        {document.voice && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shadow-lg z-50">
            <div className="relative">
                <div className="container mx-auto px-4">
                <MediaPlayer 
                    document={document} 
                    type="audio"
                    isFloating={true}
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                    onTimeUpdate={(time) => setAudioProgress(time)}
                    />
                </div>
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
} 