import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaBook, 
  FaHistory, 
  FaPaperPlane, 
  FaArrowLeft, 
  FaAngleDoubleRight 
} from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary-dark pt-20 pb-32 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 text-center lg:flex-row lg:text-right">
            <div className="w-full lg:w-1/2">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                المكتبة التاريخية الرقمية
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl">
                اكتشف آلاف الوثائق التاريخية والمخطوطات النادرة من مختلف العصور التاريخية، متاحة رقمياً للباحثين والمهتمين.
              </p>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/browse"
                  className="inline-flex min-w-40 items-center justify-center rounded-lg bg-white px-5 py-3 font-medium text-primary shadow-md transition-colors hover:bg-gray-100"
                >
                  <FaSearch className="ml-2" /> تصفح الوثائق
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-w-40 items-center justify-center rounded-lg border-2 border-white/30 bg-transparent px-5 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  <FaArrowLeft className="ml-2" /> إنشاء حساب
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative mx-auto h-80 max-w-lg rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                <div className="h-full w-full overflow-hidden rounded-lg border-4 border-white/30 bg-primary-dark/40">
                  <Image
                    src="/images/hero-manuscript.jpg"
                    alt="مخطوطة تاريخية"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover opacity-80"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">خدماتنا المميزة</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              نقدم مجموعة من الخدمات المتميزة لضمان تجربة سلسة وفعالة في استكشاف وثائقنا التاريخية
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                <FaSearch className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">بحث متقدم</h3>
              <p className="text-gray-600 dark:text-gray-400">
                محرك بحث متطور يتيح إمكانية العثور على الوثائق بسهولة باستخدام عدة معايير.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                <FaBook className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">وثائق مصنفة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                تصنيف دقيق للوثائق حسب العصور التاريخية والموضوعات المختلفة.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                <FaHistory className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">تنوع تاريخي</h3>
              <p className="text-gray-600 dark:text-gray-400">
                وثائق من مختلف العصور التاريخية بدءاً من العصور القديمة وحتى الفترة المعاصرة.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                <FaPaperPlane className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">طلب وثائق</h3>
              <p className="text-gray-600 dark:text-gray-400">
                إمكانية طلب وثائق محددة غير متوفرة حالياً في قاعدة البيانات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Eras Section */}
      <section className="bg-gray-100 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">العصور التاريخية</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              استكشف وثائقنا المصنفة حسب الفترات التاريخية المختلفة
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Ancient Era */}
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-700">
              <div className="h-48 overflow-hidden">
                <Image
                  src="/images/ancient-era.jpg"
                  alt="العصر القديم"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold">العصر القديم</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  وثائق تاريخية من الحضارات القديمة والعصور السابقة للإسلام.
                </p>
                <Link
                  href="/browse?era=ancient"
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  تصفح وثائق العصر القديم <FaAngleDoubleRight className="mr-2" />
                </Link>
              </div>
            </div>

            {/* Medieval Era */}
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-700">
              <div className="h-48 overflow-hidden">
                <Image
                  src="/images/medieval-era.jpg"
                  alt="العصر الوسيط"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold">العصر الوسيط</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  وثائق من العصور الإسلامية المبكرة وحتى نهاية العصور الوسطى.
                </p>
                <Link
                  href="/browse?era=medieval"
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  تصفح وثائق العصر الوسيط <FaAngleDoubleRight className="mr-2" />
                </Link>
              </div>
            </div>

            {/* Modern Era */}
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-700">
              <div className="h-48 overflow-hidden">
                <Image
                  src="/images/modern-era.jpg"
                  alt="العصر الحديث"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold">العصر الحديث</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  وثائق من العصر العثماني وحتى منتصف القرن العشرين.
                </p>
                <Link
                  href="/browse?era=modern"
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  تصفح وثائق العصر الحديث <FaAngleDoubleRight className="mr-2" />
                </Link>
              </div>
            </div>

            {/* Contemporary Era */}
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-700">
              <div className="h-48 overflow-hidden">
                <Image
                  src="/images/contemporary-era.jpg"
                  alt="الفترة المعاصرة"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold">الفترة المعاصرة</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  وثائق تاريخية من النصف الثاني من القرن العشرين وحتى اليوم.
                </p>
                <Link
                  href="/browse?era=contemporary"
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  تصفح وثائق الفترة المعاصرة <FaAngleDoubleRight className="mr-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">ابدأ رحلتك التاريخية اليوم</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            سجل حساباً مجانياً الآن للوصول إلى آلاف الوثائق التاريخية وميزات إضافية خاصة.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex min-w-40 items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-primary shadow-lg transition-colors hover:bg-gray-100"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/browse"
              className="inline-flex min-w-40 items-center justify-center rounded-lg border-2 border-white/50 bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              تصفح المكتبة
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">تواصل معنا</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              نحن هنا للإجابة على استفساراتك. يمكنك مراسلتنا باستخدام النموذج أدناه.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  className="block w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="أدخل موضوع الرسالة"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-center font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-offset-gray-800"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
