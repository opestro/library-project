import { Link } from "react-router";
import type { Document } from "../../lib/pocketbase";
import pb from "../../lib/pocketbase";

/**
 * Document card component for displaying a document preview
 * Used on home page, category page, and age page lists
 * 
 * @param document - The document to display
 */
interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  // Get the image URL if available
  const imageUrl = document.image 
    ? pb.files.getUrl(document, document.image, { thumb: '300x200' }) 
    : '/placeholder-document.jpg';
  
  // Format the date for display if available
  const formattedDate = document.published_at 
    ? new Date(document.published_at).toLocaleDateString('ar-SA') 
    : '';

  return (
    <Link 
      to={`/documents/${document.id}`}
      className="group bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-neutral-200 dark:border-neutral-800"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={document.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {document.title}
        </h3>
        
        <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4 flex-grow">
          {document.description || document.summary || ""}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {formattedDate && (
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {formattedDate}
            </span>
          )}
          
          <span className="text-primary text-sm font-medium">
            قراءة المزيد
          </span>
        </div>
      </div>
    </Link>
  );
} 