import { Link } from "react-router";

/**
 * Hero section for the home page
 * Features a large banner with a call to action
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white dark:from-primary/10 dark:to-neutral-950 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            <span className="text-primary">المكتبة التاريخية</span> <br />
            نافذتك إلى عبق الماضي وحضارات العالم
          </h1>
          
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            اكتشف وثائق تاريخية فريدة من مختلف العصور والحضارات، مُقدمة بأسلوب عصري يجمع بين دقة المعلومة وسهولة الوصول.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/documents" 
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md text-lg"
            >
              تصفح الوثائق
            </Link>
            <Link 
              to="/ages" 
              className="px-8 py-3 bg-white dark:bg-neutral-900 text-primary border border-primary/20 font-medium rounded-lg hover:bg-primary/5 transition-colors shadow-sm hover:shadow-md text-lg"
            >
              استكشف العصور التاريخية
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-20 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
} 