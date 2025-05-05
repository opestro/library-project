'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';
import { documentRequestApi, usersApi, historicalAgeApi, contentCategoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DocumentRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ageId: '',
    categoryId: '',
    urgency: 'normal',
    additionalInfo: '',
  });
  const [error, setError] = useState('');
  const [ages, setAges] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Check if user is authenticated
  const isAuthenticated = usersApi.isAuthenticated();

  // Fetch historical ages and categories on component mount
  useState(() => {
    const fetchData = async () => {
      try {
        const agesResult = await historicalAgeApi.getAll();
        const categoriesResult = await contentCategoryApi.getAll();
        
        if (agesResult.success && agesResult.data) {
          setAges(agesResult.data);
        }
        
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    
    fetchData();
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول لتقديم طلب');
      router.push('/login');
      return;
    }
    
    // Validate form data
    if (!formData.title.trim()) {
      setError('يرجى إدخال عنوان الطلب');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('يرجى إدخال وصف الطلب');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        age: formData.ageId || undefined,
        category: formData.categoryId || undefined,
        urgency: formData.urgency,
        additional_info: formData.additionalInfo || undefined,
        status: 'pending', // Default status for new requests
      };
      
      const result = await documentRequestApi.create(requestData);
      
      if (result.success) {
        toast.success('تم إرسال طلبك بنجاح');
        // Reset form data
        setFormData({
          title: '',
          description: '',
          ageId: '',
          categoryId: '',
          urgency: 'normal',
          additionalInfo: '',
        });
        
        // Redirect to profile page after successful submission
        router.push('/profile');
      } else {
        setError(result.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            طلب <span className="text-primary">وثيقة تاريخية</span>
          </h1>
          
          <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            {!isAuthenticated ? (
              <div className="text-center">
                <FaExclamationCircle className="mx-auto h-16 w-16 text-yellow-500" />
                <h2 className="mt-4 text-xl font-semibold">يجب تسجيل الدخول لتقديم طلب</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  يرجى تسجيل الدخول أو إنشاء حساب جديد لتتمكن من طلب وثائق تاريخية.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => router.push('/login')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  إذا كنت تبحث عن وثيقة تاريخية معينة لم تجدها في مكتبتنا، يمكنك تقديم طلب للحصول عليها. سنقوم بالبحث عنها وإضافتها إلى المكتبة في أقرب وقت ممكن.
                </p>
                
                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                      عنوان الطلب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="أدخل عنواناً واضحاً للوثيقة المطلوبة"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="ageId" className="mb-2 block text-sm font-medium">
                        العصر التاريخي
                      </label>
                      <select
                        id="ageId"
                        name="ageId"
                        value={formData.ageId}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">-- اختر العصر التاريخي --</option>
                        {ages.map((age) => (
                          <option key={age.id} value={age.id}>
                            {age.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="categoryId" className="mb-2 block text-sm font-medium">
                        التصنيف
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">-- اختر التصنيف --</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                      وصف الطلب <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="اشرح بالتفصيل الوثيقة التي تبحث عنها، مع ذكر أكبر قدر ممكن من المعلومات المتاحة عنها."
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="urgency" className="mb-2 block text-sm font-medium">
                      درجة الأهمية
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">منخفضة - غير مستعجل</option>
                      <option value="normal">متوسطة - خلال شهر</option>
                      <option value="high">عالية - خلال أسبوع</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="additionalInfo" className="mb-2 block text-sm font-medium">
                      معلومات إضافية
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="أي معلومات أخرى قد تساعدنا في العثور على الوثيقة المطلوبة."
                    ></textarea>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        <FaCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">قبل التقديم</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          نأمل التأكد من عدم وجود الوثيقة المطلوبة في قسم <a href="/browse" className="text-primary hover:text-primary-dark">تصفح الوثائق</a> قبل إرسال الطلب.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-center text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        جاري إرسال الطلب...
                      </span>
                    ) : (
                      <>
                        <FaPaperPlane className="ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 