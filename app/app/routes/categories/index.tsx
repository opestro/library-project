import Layout from "../../components/layout/Layout";
import CategoriesSection from "../../components/sections/CategoriesSection";

/**
 * Categories listing page
 * Shows all content categories
 */
export default function CategoriesPage() {
  return (
    <Layout>
      <div className="pt-12 pb-4">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              تصنيفات المحتوى
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              تصفح الوثائق التاريخية حسب التصنيف واكتشف مجموعة متنوعة من المواضيع والمجالات.
            </p>
          </div>
        </div>
      </div>

      <CategoriesSection showViewAll={false} limit={100} />
    </Layout>
  );
} 