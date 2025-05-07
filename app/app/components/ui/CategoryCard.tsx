import { Link } from "react-router";
import type { Category } from "../../lib/pocketbase";

/**
 * Card component for displaying a content category
 * Used on home page and categories listing page
 * 
 * @param category - The category to display
 * @param documentCount - Optional count of documents in this category
 */
interface CategoryCardProps {
  category: Category;
  documentCount?: number;
}

export default function CategoryCard({ category, documentCount }: CategoryCardProps) {
  // Generate a deterministic color based on the category name
  const getColorClass = (name: string) => {
    const colorOptions = [
      'bg-primary/10 text-primary border-primary/20',
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    ];
    
    // Use the sum of character codes to pick a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorOptions[sum % colorOptions.length];
  };

  const colorClass = getColorClass(category.name);

  return (
    <Link 
      to={`/categories/${category.id}`} 
      className={`group block p-6 border rounded-xl transition-all duration-300 ${colorClass} hover:shadow-md`}
    >
      <h3 className="text-xl font-semibold mb-2">
        {category.name}
      </h3>
      
      {category.description && (
        <div 
          className="opacity-80 text-sm line-clamp-2 mb-4"
          dangerouslySetInnerHTML={{ 
            __html: typeof category.description === 'string' 
              ? category.description.substring(0, 120) + (category.description.length > 120 ? '...' : '')
              : ''
          }}
        />
      )}
      
      {documentCount !== undefined && (
        <div className="mt-2 text-sm font-medium">
          {documentCount} {documentCount === 1 ? 'وثيقة' : documentCount >= 2 && documentCount <= 10 ? 'وثائق' : 'وثيقة'}
        </div>
      )}
    </Link>
  );
} 