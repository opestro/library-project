import { Link } from "react-router";
import { useState, useEffect } from "react";
import CategoryCard from "../ui/CategoryCard";
import pb from "../../lib/pocketbase";
import type { Category } from "../../lib/pocketbase";

/**
 * Section component for displaying a grid of content categories
 * Used on the home page and can be reused elsewhere
 * 
 * @param limit - Optional limit of items to display
 * @param showViewAll - Whether to show the "View All" link
 * @param title - Optional custom title for the section
 */
interface CategoriesSectionProps {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
}

export default function CategoriesSection({ 
  limit = 6, 
  showViewAll = true,
  title = "التصنيفات"
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDocCounts, setCategoryDocCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch categories from PocketBase
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await pb.collection('categories').getList(1, limit, {
          sort: 'name',
        });
        
        // Cast to unknown first to avoid TypeScript error
        setCategories(response.items as unknown as Category[]);
        
        // Fetch document counts for each category
        const categoryIds = response.items.map(item => item.id);
        const countPromises = categoryIds.map(async (categoryId) => {
          const docsCount = await pb.collection('documents').getList(1, 1, {
            filter: `category = "${categoryId}"`,
          });
          return { id: categoryId, count: docsCount.totalItems };
        });
        
        const countResults = await Promise.all(countPromises);
        const countsMap: Record<string, number> = {};
        countResults.forEach(result => {
          countsMap[result.id] = result.count;
        });
        
        setCategoryDocCounts(countsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حدث خطأ أثناء تحميل التصنيفات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h2>
          
          {showViewAll && (
            <Link 
              to="/categories" 
              className="text-primary hover:text-primary-dark font-medium flex items-center transition-colors"
            >
              عرض الكل
              <span className="mr-1 rtl:rotate-180">&rarr;</span>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
              <div 
                key={index} 
                className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-32 animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
            لا توجد تصنيفات لعرضها
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                documentCount={categoryDocCounts[category.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 