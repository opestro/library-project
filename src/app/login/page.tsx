'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { usersApi } from '@/lib/api';
import { MainLayout } from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    acceptTerms: false,
    rememberMe: false,
  });
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, password, rememberMe } = formData;
      const result = await usersApi.login(email, password);

      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح');
        router.push('/browse');
      } else {
        setError(result.error || 'خطأ في تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { name, email, password, passwordConfirm, acceptTerms } = formData;

      // Simple validation
      if (!name || !email || !password || !passwordConfirm) {
        setError('الرجاء إدخال جميع الحقول المطلوبة');
        setIsLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setError('كلمتا المرور غير متطابقتين');
        setIsLoading(false);
        return;
      }

      if (!acceptTerms) {
        setError('يجب الموافقة على الشروط والأحكام');
        setIsLoading(false);
        return;
      }

      const result = await usersApi.register({
        name,
        email,
        password,
        passwordConfirm,
      });

      if (result.success) {
        toast.success('تم إنشاء الحساب بنجاح');
        // Auto login
        const loginResult = await usersApi.login(email, password);
        if (loginResult.success) {
          router.push('/browse');
        } else {
          setIsLogin(true);
          toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        }
      } else {
        setError(result.error || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            {isLogin ? 'تسجيل' : 'إنشاء'} <span className="text-primary">الدخول</span>
          </h1>

          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            {/* Tabs */}
            <div className="mb-8 flex rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              <button
                className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
                  isLogin
                    ? 'bg-white text-primary shadow-sm dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
                onClick={() => setIsLogin(true)}
              >
                تسجيل الدخول
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
                  !isLogin
                    ? 'bg-white text-primary shadow-sm dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
                onClick={() => setIsLogin(false)}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <p>{error}</p>
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="login-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember-me" className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                      تذكرني
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary-dark dark:text-blue-400"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-center text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {isLoading ? (
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
                      جاري تسجيل الدخول...
                    </span>
                  ) : (
                    <>
                      <FaSignInAlt className="ml-2" />
                      تسجيل الدخول
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="register-name" className="mb-2 block text-sm font-medium">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className="mb-2 block text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-password-confirm" className="mb-2 block text-sm font-medium">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="register-password-confirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="أعد إدخال كلمة المرور"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="accept-terms" className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                    أوافق على{' '}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary-dark dark:text-blue-400"
                    >
                      الشروط والأحكام
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-center text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {isLoading ? (
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
                      جاري إنشاء الحساب...
                    </span>
                  ) : (
                    <>
                      <FaUserPlus className="ml-2" />
                      إنشاء حساب
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    أو باستخدام
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FaGoogle className="ml-2 h-5 w-5 text-red-500" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FaFacebookF className="ml-2 h-5 w-5 text-blue-500" />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 