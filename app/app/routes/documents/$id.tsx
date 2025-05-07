import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Layout from "../../components/layout/Layout";
import pb from "../../lib/pocketbase";
import type { Document, Age, Category } from "../../lib/pocketbase";

/**
 * Document detail page
 * Shows detailed information about a historical document
 */
export default function DocumentDetailPage() {
  const { id } = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [age, setAge] = useState<Age | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const record = await pb.collection('documents').getOne(id!, {
          expand: 'age,category',
        });
        
        setDocument(record as unknown as Document);
        
        if (record.expand?.age) {
          setAge(record.expand.age as unknown as Age);
        }
        
        if (record.expand?.category) {
          setCategory(record.expand.category as unknown as Category);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('حدث خطأ أثناء تحميل بيانات الوثيقة');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

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
            <Link 
              to="/"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12">
        {/* Document Header */}
        <header className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {document.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm mb-8">
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
            
            {document.published_at && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <span className="sr-only">تاريخ النشر:</span>
                {new Date(document.published_at).toLocaleDateString('ar-SA')}
              </span>
            )}
          </div>
        </header>

        {/* Document Content */}
        <div className="max-w-4xl mx-auto">
          {document.image && (
            <div className="mb-12">
              <img
                src={pb.files.getUrl(document, document.image)}
                alt={document.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
          
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
      </article>
    </Layout>
  );
} 