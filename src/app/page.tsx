/**
 * Home Page
 * 
 * Main landing page for the Digital Historical Library with iOS-style UI.
 * Showcases the library's features and document collections.
 * Dynamically loads data from PocketBase.
 */
import { HistoricalAgeAPI } from '@/lib/api';
import { Navigation } from '@/components/shared/Navigation';
import { Hero } from '@/components/shared/Hero';
import { Footer } from '@/components/shared/Footer';
import { Card, CardImage, CardContent, CardMeta, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FeatureCard } from '@/components/shared/FeatureCard';
import Link from 'next/link';
import { HistoricalAge } from '@/types';

// Default image for fallback
const DEFAULT_ERA_IMAGE = "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

// Function to count documents for an era (placeholder - will be implemented with real data)
const getDocumentCount = async (eraId: string): Promise<number> => {
  // In a real implementation, you would fetch the actual count from PocketBase
  // For now, return a random number between 200 and 800
  return Math.floor(Math.random() * 600) + 200;
};

export default async function Home() {
  // Fetch historical ages from PocketBase
  const ageApi = new HistoricalAgeAPI();
  const agesResponse = await ageApi.getAll();
  
  // Use real data if available, otherwise use empty array
  const historicalAges: HistoricalAge[] = agesResponse.success ? (agesResponse.data || []) : [];
  
  // Get document counts for each era
  const agesWithCounts = await Promise.all(
    historicalAges.map(async (age) => {
      const documentCount = await getDocumentCount(age.id);
      return {
        ...age,
        documentCount,
        languages: 8, // Fixed for now, could be dynamic in the future
        // Use a default image URL if none is provided
        imageUrl: DEFAULT_ERA_IMAGE
      };
    })
  );
  
  // Features data - this could also come from a CMS in the future
  const features = [
    {
      icon: <i className="fas fa-book-open"></i>,
      title: "أرشيف غني",
      description: "مجموعة شاملة من الوثائق التاريخية تغطي مختلف العصور والحقب الزمنية بتفاصيل دقيقة"
    },
    {
      icon: <i className="fas fa-search-plus"></i>,
      title: "استكشاف متقدم",
      description: "أدوات بحث متطورة تتيح للباحثين والمؤرخين استكشاف الوثائق بسهولة وفعالية"
    },
    {
      icon: <i className="fas fa-language"></i>,
      title: "ترجمة فورية",
      description: "ترجمة آلية دقيقة للوثائق التاريخية إلى ثمان لغات مختلفة باستخدام نماذج لغوية متقدمة"
    },
    {
      icon: <i className="fas fa-desktop"></i>,
      title: "تجربة تفاعلية",
      description: "واجهة مستخدم سهلة وتفاعلية تعمل على جميع الأجهزة مع دعم كامل للتصفح الصوتي"
    },
    {
      icon: <i className="fas fa-eye"></i>,
      title: "تعرف بصري",
      description: "استخدام تقنيات التعرف البصري لقراءة المخطوطات القديمة وتحويلها إلى نصوص رقمية"
    },
    {
      icon: <i className="fas fa-microphone-alt"></i>,
      title: "تعليق صوتي",
      description: "تعليقات صوتية عالية الجودة مُنتجة بواسطة تقنية تحويل النص إلى كلام بصوت طبيعي"
    }
  ];

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="sr-only">تخطي إلى المحتوى الرئيسي</a>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <main id="main-content">
        {/* Historical Eras Section */}
        <section id="ages" className="section" aria-labelledby="ages-title">
          <div className="container">
            <h2 id="ages-title" className="section-title">العصور <span>التاريخية</span></h2>
            <div className="section-description">
              <p>استكشف مجموعتنا الفريدة من الوثائق التاريخية المصنفة حسب العصور المختلفة، مع قاعدة بيانات غنية ومتنوعة من المخطوطات والمستندات النادرة</p>
            </div>
            
            {agesWithCounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agesWithCounts.map((era) => (
                  <Card key={era.id}>
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="primary" rounded>
                        <i className="fas fa-history"></i>
                        <span className="mr-1">وثائق أصلية</span>
                      </Badge>
                    </div>
                    
                    <CardImage 
                      src={era.imageUrl} 
                      alt={era.name} 
                      className="card-img"
                    />
                    
                    <CardContent>
                      <h3 className="text-xl font-bold mb-2">{era.name}</h3>
                      <p className="text-sm text-theme-text-secondary">
                        {era.description 
                          ? era.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                          : `استكشف الوثائق التاريخية من ${era.name} بمختلف أنواعها وتصنيفاتها`}
                      </p>
                      
                      <CardMeta>
                        <span>
                          <i className="fas fa-file-alt"></i>
                          {era.documentCount}+ وثيقة
                        </span>
                        <span>
                          <i className="fas fa-language"></i>
                          {era.languages} لغات
                        </span>
                      </CardMeta>
                      
                      <CardFooter>
                        <Link href={`/browse?age=${era.id}`} passHref>
                          <Button variant="primary" className="w-full">
                            <i className="fas fa-search"></i>
                            <span className="mr-2">عرض الوثائق</span>
                          </Button>
                        </Link>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-theme-text-secondary">
                  جاري تحميل العصور التاريخية...
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="section" style={{ backgroundColor: 'var(--secondary-background)' }} aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title">مميزات <span>المكتبة</span></h2>
            <div className="section-description">
              <p>اكتشف المميزات الفريدة التي توفرها مكتبتنا الرقمية المدعومة بأحدث تقنيات الذكاء الاصطناعي والأمان</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
} 