import { Link } from "react-router";

/**
 * Hero section for the home page
 * Features a large banner with a call to action and a sophisticated background design
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://img.freepik.com/free-photo/top-view-love-letters-arrangement_23-2150716594.jpg?w=2000")'
        }}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-white/10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-primary">المكتبة التاريخية</span> <br />
              نافذتك إلى عبق الماضي وحضارات العالم
            </h1>
            
            <p className="text-xl text-neutral-200 mb-8 max-w-2xl leading-relaxed">
              اكتشف وثائق تاريخية فريدة من مختلف العصور والحضارات، مُقدمة بأسلوب عصري يجمع بين دقة المعلومة وسهولة الوصول.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/documents" 
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary/30 text-lg group"
              >
                <span className="flex items-center justify-center gap-2">
                  تصفح الوثائق
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link 
                to="/ages" 
                className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-medium rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-white/10 text-lg group"
              >
                <span className="flex items-center justify-center gap-2">
                  استكشف العصور التاريخية
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Decorative Elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 -right-24 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </section>
  );
} 