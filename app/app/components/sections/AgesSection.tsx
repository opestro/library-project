import { Link } from "react-router";
import { useState, useEffect } from "react";
import AgeCard from "../ui/AgeCard";
import pb from "../../lib/pocketbase";
import type { Age } from "../../lib/pocketbase";

/**
 * Section component for displaying a grid of historical ages
 * Used on the home page and can be reused elsewhere
 * 
 * @param limit - Optional limit of items to display
 * @param showViewAll - Whether to show the "View All" link
 * @param title - Optional custom title for the section
 * @param cancelKey - Optional unique identifier for cancellation
 */
interface AgesSectionProps {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  cancelKey?: string;
}

export default function AgesSection({ 
  limit = 4, 
  showViewAll = true,
  title = "العصور التاريخية",
  cancelKey = "ages-section"
}: AgesSectionProps) {
  const [ages, setAges] = useState<Age[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to handle request cancellation
    const abortController = new AbortController();
    
    // Create a unique cancelKey for this specific section instance
    const uniqueCancelKey = `${cancelKey}-${limit}`;

    // Fetch ages from PocketBase
    const fetchAges = async () => {
      try {
        setLoading(true);
        const response = await pb.collection('ages').getList(1, limit, {
          sort: '-created',
          $cancelKey: uniqueCancelKey,
        });
        
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          // Cast to unknown first to avoid TypeScript error
          setAges(response.items as unknown as Age[]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching ages:', err);
        
        // Only update error state if it's not a cancellation error and component is mounted
        if (!abortController.signal.aborted && err instanceof Error && !err.message.includes('autocancelled')) {
          setError('حدث خطأ أثناء تحميل العصور التاريخية');
        }
      } finally {
        // Only update loading state if the component is still mounted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAges();
    
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
      // Also cancel any pending PocketBase requests with the same cancelKey
      pb.cancelRequest(uniqueCancelKey);
    };
  }, [limit, cancelKey]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h2>
          
          {showViewAll && (
            <Link 
              to="/ages" 
              className="text-primary hover:text-primary-dark font-medium flex items-center transition-colors"
            >
              عرض الكل
              <span className="mr-1 rtl:rotate-180">&rarr;</span>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, index) => (
              <div 
                key={index} 
                className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            {error}
          </div>
        ) : ages.length === 0 ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            لا توجد عصور تاريخية لعرضها
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ages.map(age => (
              <AgeCard key={age.id} age={age} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 