/**
 * SearchFilters.tsx
 * 
 * A reusable search filters component with iOS-style design.
 * Used for filtering document search results.
 */
import { useState } from 'react';
import { FaFilter, FaTimes, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';

// Define sort options as a type
type SortOption = 'newest' | 'oldest' | 'popular' | 'relevant';

export interface SearchFiltersProps {
  /**
   * Currently applied filters
   */
  filters: {
    search?: string;
    category?: string;
    era?: string;
    dateFrom?: string;
    dateTo?: string;
    onlyFree?: boolean;
    sortBy?: SortOption;
  };
  /**
   * Function called when filters change
   */
  onChange: (filters: any) => void;
  /**
   * Available categories for filtering
   */
  categories?: { id: string; name: string }[];
  /**
   * Available eras for filtering
   */
  eras?: { id: string; name: string }[];
  /**
   * Optional custom class names
   */
  className?: string;
  /**
   * Whether the advanced filters are expanded by default
   */
  defaultExpanded?: boolean;
}

export function SearchFilters({
  filters,
  onChange,
  categories = [],
  eras = [],
  className,
  defaultExpanded = false,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(defaultExpanded);
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    onChange(localFilters);
  };
  
  // Reset filters
  const resetFilters = () => {
    const resetValues = {
      search: '',
      category: undefined,
      era: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      onlyFree: false,
      sortBy: 'newest' as SortOption,
    };
    setLocalFilters(resetValues);
    onChange(resetValues);
  };
  
  // Handle era selection
  const handleEraChange = (eraId: string) => {
    setLocalFilters({
      ...localFilters,
      era: eraId === localFilters.era ? undefined : eraId,
    });
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setLocalFilters({
      ...localFilters,
      category: categoryId === localFilters.category ? undefined : categoryId,
    });
  };
  
  // Handle sort by change
  const handleSortChange = (sortBy: string) => {
    setLocalFilters({
      ...localFilters,
      sortBy: sortBy as SortOption,
    });
  };
  
  // Create tab items for sort options
  const sortTabs = [
    { id: 'newest', label: 'الأحدث' },
    { id: 'oldest', label: 'الأقدم' },
    { id: 'popular', label: 'الأكثر مشاهدة' },
    { id: 'relevant', label: 'الأكثر صلة' },
  ];
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Search input with filter toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            name="search"
            value={localFilters.search || ''}
            onChange={handleInputChange}
            placeholder="ابحث في الوثائق التاريخية..."
            prefix={<FaSearch className="h-4 w-4" />}
            suffix={
              localFilters.search ? (
                <button
                  onClick={() => {
                    setLocalFilters({ ...localFilters, search: '' });
                  }}
                  className="text-[#8E8E93] hover:text-[#FF3B30]"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              ) : null
            }
          />
        </div>
        <Button
          variant={showAdvanced ? 'primary' : 'secondary'}
          size="md"
          leftIcon={<FaFilter className="h-4 w-4" />}
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
        >
          فلترة
        </Button>
      </div>
      
      {/* Advanced filters */}
      {showAdvanced && (
        <Card className="p-4 border border-[#E5E5EA] dark:border-gray-700">
          <div className="space-y-6">
            {/* Sort options */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#1C1C1E] dark:text-white">ترتيب حسب</h3>
              <Tabs
                tabs={sortTabs}
                activeTab={localFilters.sortBy || 'newest'}
                onChange={handleSortChange}
                variant="segmented"
                size="sm"
              />
            </div>
            
            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#1C1C1E] dark:text-white">التصنيف</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={localFilters.category === category.id ? 'default' : 'secondary'}
                      size="md"
                      rounded
                      className="cursor-pointer"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Eras */}
            {eras.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#1C1C1E] dark:text-white">العصر التاريخي</h3>
                <div className="flex flex-wrap gap-2">
                  {eras.map((era) => (
                    <Badge
                      key={era.id}
                      variant={localFilters.era === era.id ? 'default' : 'secondary'}
                      size="md"
                      rounded
                      className="cursor-pointer"
                      onClick={() => handleEraChange(era.id)}
                    >
                      {era.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Date range */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#1C1C1E] dark:text-white">التاريخ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  name="dateFrom"
                  type="date"
                  label="من"
                  value={localFilters.dateFrom || ''}
                  onChange={handleInputChange}
                  prefix={<FaCalendarAlt className="h-4 w-4" />}
                />
                <Input
                  name="dateTo"
                  type="date"
                  label="إلى"
                  value={localFilters.dateTo || ''}
                  onChange={handleInputChange}
                  prefix={<FaCalendarAlt className="h-4 w-4" />}
                />
              </div>
            </div>
            
            {/* Options */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#1C1C1E] dark:text-white">خيارات إضافية</h3>
              <div className="space-y-2">
                <Switch
                  name="onlyFree"
                  label="الوثائق المجانية فقط"
                  checked={localFilters.onlyFree || false}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={resetFilters}
              >
                إعادة تعيين
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={applyFilters}
              >
                تطبيق الفلاتر
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Active filters summary */}
      {(localFilters.category || localFilters.era || localFilters.dateFrom || 
        localFilters.dateTo || localFilters.onlyFree) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-[#8E8E93] dark:text-gray-400">الفلاتر النشطة:</span>
          
          {localFilters.category && (
            <Badge variant="secondary" size="sm" className="flex items-center gap-1">
              {categories.find(c => c.id === localFilters.category)?.name || localFilters.category}
              <button
                onClick={() => setLocalFilters({ ...localFilters, category: undefined })}
                className="ml-1 text-[#8E8E93] hover:text-[#FF3B30]"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {localFilters.era && (
            <Badge variant="secondary" size="sm" className="flex items-center gap-1">
              {eras.find(e => e.id === localFilters.era)?.name || localFilters.era}
              <button
                onClick={() => setLocalFilters({ ...localFilters, era: undefined })}
                className="ml-1 text-[#8E8E93] hover:text-[#FF3B30]"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {(localFilters.dateFrom || localFilters.dateTo) && (
            <Badge variant="secondary" size="sm" className="flex items-center gap-1">
              {localFilters.dateFrom && localFilters.dateTo 
                ? `${localFilters.dateFrom} - ${localFilters.dateTo}`
                : localFilters.dateFrom 
                  ? `من ${localFilters.dateFrom}` 
                  : `حتى ${localFilters.dateTo}`
              }
              <button
                onClick={() => setLocalFilters({ ...localFilters, dateFrom: undefined, dateTo: undefined })}
                className="ml-1 text-[#8E8E93] hover:text-[#FF3B30]"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {localFilters.onlyFree && (
            <Badge variant="secondary" size="sm" className="flex items-center gap-1">
              الوثائق المجانية فقط
              <button
                onClick={() => setLocalFilters({ ...localFilters, onlyFree: false })}
                className="ml-1 text-[#8E8E93] hover:text-[#FF3B30]"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[#FF3B30] hover:bg-[#FF3B30]/10"
          >
            مسح الكل
          </Button>
        </div>
      )}
    </div>
  );
} 