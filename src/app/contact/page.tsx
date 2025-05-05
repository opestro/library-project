'use client';

import { useState } from 'react';
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';
import { contactMessageApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'يرجى إدخال الاسم';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'يرجى إدخال الموضوع';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'يرجى إدخال الرسالة';
    } else if (formData.message.length < 10) {
      newErrors.message = 'يجب أن تكون الرسالة 10 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await contactMessageApi.create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'unread',  // Default status for new messages
      });
      
      if (result.success) {
        toast.success('تم إرسال رسالتك بنجاح');
        // Reset form data
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(result.error || 'حدث خطأ أثناء إرسال الرسالة');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            اتصل <span className="text-primary">بنا</span>
          </h1>
          
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-semibold">معلومات الاتصال</h2>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                      <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">العنوان</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        شارع المكتبة، حي المعرفة،<br />
                        الرياض، المملكة العربية السعودية
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                      <FaEnvelope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">البريد الإلكتروني</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href="mailto:info@historicallibrary.com" className="hover:text-primary">
                          info@historicallibrary.com
                        </a>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                      <FaPhone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">رقم الهاتف</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href="tel:+9661234567890" className="hover:text-primary">
                          +966 12 345 6789
                        </a>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                      <FaClock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">ساعات العمل</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        الأحد - الخميس: 9:00 ص - 5:00 م<br />
                        الجمعة - السبت: مغلق
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-semibold">أرسل لنا رسالة</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        الاسم <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        placeholder="أدخل اسمك"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                      الموضوع <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      } p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                      placeholder="أدخل موضوع الرسالة"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                      الرسالة <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`block w-full rounded-md border ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      } p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                      placeholder="اكتب رسالتك هنا..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-center text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
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
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>
                        <FaPaperPlane className="ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Map (Placeholder - would be replaced with actual map component) */}
          <div className="mt-12 rounded-lg bg-gray-200 dark:bg-gray-700">
            <div className="aspect-[16/7] w-full rounded-lg bg-gray-300 dark:bg-gray-600">
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  هنا يمكن إضافة خريطة تفاعلية
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 