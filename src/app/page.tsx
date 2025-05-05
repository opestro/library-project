import Link from 'next/link';
import { FaBook, FaSearch, FaHistory, FaUserEdit } from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-900 dark:text-white md:text-5xl">
            المكتبة التاريخية <span className="text-primary">الرقمية</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            اكتشف كنوز التاريخ من خلال مجموعتنا الفريدة من الوثائق التاريخية الرقمية المحفوظة والمصنفة بعناية
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/browse"
              className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-dark hover:shadow-xl"
            >
              تصفح الوثائق
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-primary bg-transparent px-6 py-3 text-lg font-semibold text-primary transition hover:bg-primary-50 dark:hover:bg-gray-800"
            >
              انضم إلينا
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">خدماتنا المميزة</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-gray-700">
                <FaSearch className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">بحث متقدم</h3>
              <p className="text-gray-600 dark:text-gray-300">
                امكانية البحث في الوثائق التاريخية بواسطة العصر، التصنيف، أو الكلمات المفتاحية
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-gray-700">
                <FaBook className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">وثائق مصنفة</h3>
              <p className="text-gray-600 dark:text-gray-300">
                وثائق مصنفة حسب العصور التاريخية والفئات لسهولة الوصول والتنظيم
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-gray-700">
                <FaHistory className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">تنوع تاريخي</h3>
              <p className="text-gray-600 dark:text-gray-300">
                وثائق من مختلف العصور التاريخية: القديم، الوسيط، الحديث والمعاصر
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-gray-700">
                <FaUserEdit className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">طلب وثائق</h3>
              <p className="text-gray-600 dark:text-gray-300">
                إمكانية طلب وثائق محددة غير متوفرة حاليًا في المكتبة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Eras Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">العصور التاريخية</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Era 1 */}
            <Link href="/browse?age=1" className="block">
              <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">العصر القديم</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  من بداية التاريخ المكتوب حتى سقوط الإمبراطورية الرومانية الغربية
                </p>
                <span className="mt-auto text-primary hover:underline">تصفح الوثائق</span>
              </div>
            </Link>

            {/* Era 2 */}
            <Link href="/browse?age=2" className="block">
              <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">العصر الوسيط</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  من القرن الخامس حتى القرن الخامس عشر الميلادي
                </p>
                <span className="mt-auto text-primary hover:underline">تصفح الوثائق</span>
              </div>
            </Link>

            {/* Era 3 */}
            <Link href="/browse?age=3" className="block">
              <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">العصر الحديث</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  من القرن السادس عشر حتى نهاية الحرب العالمية الثانية
                </p>
                <span className="mt-auto text-primary hover:underline">تصفح الوثائق</span>
              </div>
            </Link>

            {/* Era 4 */}
            <Link href="/browse?age=4" className="block">
              <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">العصر المعاصر</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  من نهاية الحرب العالمية الثانية حتى يومنا هذا
                </p>
                <span className="mt-auto text-primary hover:underline">تصفح الوثائق</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">ابدأ رحلتك التاريخية</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            انضم إلينا اليوم واستكشف آلاف الوثائق التاريخية من مختلف العصور
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-white px-6 py-3 text-lg font-semibold text-primary shadow-lg transition hover:bg-gray-100"
          >
            إنشاء حساب مجاني
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">اتصل بنا</h2>
          <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              لديك استفسار أو اقتراح؟ نحن هنا للمساعدة! يمكنك التواصل معنا من خلال النموذج التالي.
            </p>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    placeholder="أدخل بريدك الإلكتروني"
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
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  placeholder="أدخل موضوع الرسالة"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  placeholder="اكتب رسالتك هنا"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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