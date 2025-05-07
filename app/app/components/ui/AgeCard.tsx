import { Link } from "react-router";
import type { Age } from "../../lib/pocketbase";
import pb from "../../lib/pocketbase";

/**
 * Card component for displaying a historical age
 * Used on home page and ages listing page
 * 
 * @param age - The historical age to display
 */
interface AgeCardProps {
  age: Age;
}

export default function AgeCard({ age }: AgeCardProps) {
  // Get the image URL if available
  const imageUrl = age.image 
    ? pb.files.getUrl(age, age.image, { thumb: '300x200' }) 
    : '/placeholder-age.jpg';
  
  // Format the year range if available
  const yearRange = age.start_year !== null && age.end_year !== null
    ? `${age.start_year} - ${age.end_year}`
    : age.start_year !== null
      ? `${age.start_year} وما بعده`
      : age.end_year !== null
        ? `حتى ${age.end_year}`
        : '';

  return (
    <Link 
      to={`/ages/${age.id}`}
      className="group bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-neutral-200 dark:border-neutral-800"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={age.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {yearRange && (
          <div className="absolute bottom-0 right-0 bg-primary/80 text-white px-3 py-1 text-sm font-medium">
            {yearRange}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary transition-colors">
          {age.name}
        </h3>
        
        {age.description && (
          <div 
            className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: typeof age.description === 'string' 
                ? age.description.substring(0, 150) + (age.description.length > 150 ? '...' : '')
                : ''
            }}
          />
        )}
      </div>
    </Link>
  );
} 