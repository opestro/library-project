import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import DocumentsSection from "../../components/sections/DocumentsSection";
import pb from "../../lib/pocketbase";
import type { Age, Category } from "../../lib/pocketbase";

/**
 * Documents listing page
 * Shows all documents with filtering options
 */
export default function DocumentsPage() {
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ages, setAges] = useState<Age[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        
        // Fetch ages and categories in parallel
        const [agesResponse, categoriesResponse] = await Promise.all([
          pb.collection('ages').getList(1, 100, { sort: 'name' }),
          pb.collection('categories').getList(1, 100, { sort: 'name' })
        ]);

        setAges(agesResponse.items as unknown as Age[]);
        setCategories(categoriesResponse.items as unknown as Category[]);
      } catch (err) {
        console.error('Error fetching filters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Build filter string based on selections and search query
  const buildFilter = () => {
    const filters = ['published_at != null'];
    
    if (selectedAge) {
      filters.push(`age = "${selectedAge}"`);
    }
    
    if (selectedCategory) {
      filters.push(`category = "${selectedCategory}"`);
    }
    
    if (searchQuery.trim()) {
      filters.push(`(title ~ "${searchQuery}" || description ~ "${searchQuery}" || content ~ "${searchQuery}")`);
    }
    
    return filters.join(' && ');
  };

  return (
    <Layout>
      <div className="pt-12 pb-4">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              الوثائق التاريخية
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              استكشف مجموعتنا من الوثائق التاريخية المتنوعة. يمكنك البحث وتصفية النتائج حسب العصر والتصنيف.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="max-w-xl">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الوثائق..."
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">جميع العصور</option>
                {ages.map((age) => (
                  <option key={age.id} value={age.id}>
                    {age.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {(selectedAge || selectedCategory || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedAge("");
                    setSelectedCategory("");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
                >
                  إعادة تعيين
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DocumentsSection 
        showViewAll={false} 
        limit={24} 
        filter={buildFilter()}
        title={
          selectedAge || selectedCategory || searchQuery
            ? "نتائج البحث" 
            : "جميع الوثائق"
        }
      />
    </Layout>
  );
} 