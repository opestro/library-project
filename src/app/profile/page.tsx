'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaEdit, 
  FaFileAlt, 
  FaClipboardList,
  FaEye,
  FaTrash,
  FaPlus,
  FaSignOutAlt
} from 'react-icons/fa';
import { MainLayout } from '@/components/layout/MainLayout';
import { usersApi, documentsApi, documentRequestApi } from '@/lib/api';
import { User, DocumentRequest, HistoricalDocument } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Component for document requests tab
const DocumentRequestsTab = ({ requests }: { requests: DocumentRequest[] }) => {
  const statusBadgeClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  const getStatusTranslation = (status: string) => {
    const translations: Record<string, string> = {
      pending: 'قيد الانتظار',
      approved: 'تمت الموافقة',
      rejected: 'مرفوض',
      fulfilled: 'مكتمل'
    };
    return translations[status] || status;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">طلبات الوثائق</h2>
        <a 
          href="/request" 
          className="flex items-center rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary-dark"
        >
          <FaPlus className="ml-1" /> طلب جديد
        </a>
      </div>
      
      {requests.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  عنوان الطلب
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  تاريخ الطلب
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{request.title}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.created, 'ar-EG')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClasses(request.status)}`}>
                      {getStatusTranslation(request.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                    <button 
                      className="ml-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => toast.success('سيتم إضافة تفاصيل الطلب قريباً')}
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    {request.status === 'pending' && (
                      <button 
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => toast.success('سيتم إضافة خاصية الحذف قريباً')}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <FaClipboardList className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">لا توجد طلبات حتى الآن</p>
          <a href="/request" className="mt-2 text-primary hover:underline">إضافة طلب جديد</a>
        </div>
      )}
    </div>
  );
};

// Component for user documents tab
const UserDocumentsTab = ({ documents }: { documents: HistoricalDocument[] }) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">وثائقي</h2>
        <a 
          href="/submit-document" 
          className="flex items-center rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary-dark"
        >
          <FaPlus className="ml-1" /> إضافة وثيقة
        </a>
      </div>
      
      {documents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="p-5">
                <h3 className="mb-2 line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                  {doc.title}
                </h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  {doc.expand?.category && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {doc.expand.category.name}
                    </span>
                  )}
                  {doc.expand?.age && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {doc.expand.age.name}
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    doc.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : doc.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {doc.status === 'published' ? 'منشور' : doc.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {doc.summary || 'لا يوجد ملخص'}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <FaCalendarAlt className="ml-1" />
                    {formatDate(doc.published_at || doc.created, 'ar-EG')}
                  </span>
                  <span className="flex items-center">
                    <FaEye className="ml-1" />
                    {doc.view_count || 0} مشاهدة
                  </span>
                </div>
              </div>
              <div className="flex divide-x divide-gray-200 border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                <a 
                  href={`/document/${doc.id}`} 
                  className="flex flex-1 items-center justify-center py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <FaEye className="ml-1 h-4 w-4" />
                  عرض
                </a>
                <a 
                  href={`/edit-document/${doc.id}`} 
                  className="flex flex-1 items-center justify-center py-2.5 text-sm font-medium text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                >
                  <FaEdit className="ml-1 h-4 w-4" />
                  تعديل
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <FaFileAlt className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">لم تقم بإضافة أي وثائق حتى الآن</p>
          <a href="/submit-document" className="mt-2 text-primary hover:underline">إضافة وثيقة جديدة</a>
        </div>
      )}
    </div>
  );
};

// Component for user profile tab
const ProfileTab = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center">
          <div className="mr-4 h-20 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'صورة المستخدم'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FaUser className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">{user.name || 'مستخدم المكتبة'}</h2>
            <p className="flex items-center text-gray-600 dark:text-gray-400">
              <FaEnvelope className="ml-1" /> 
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">معلومات الحساب</h3>
            <div className="space-y-2">
              <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span className="ml-2 font-medium">تاريخ الإنضمام:</span>
                <span>{formatDate(user.created, 'ar-EG')}</span>
              </p>
              <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span className="ml-2 font-medium">حالة البريد الإلكتروني:</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.verified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {user.verified ? 'تم التحقق' : 'غير محقق'}
                </span>
              </p>
            </div>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">إحصائيات</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">الوثائق</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">الطلبات</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <a 
            href="/edit-profile" 
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            <FaEdit className="ml-2" />
            تعديل الملف الشخصي
          </a>
          <button 
            onClick={onLogout}
            className="inline-flex items-center rounded-md border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-900/10"
          >
            <FaSignOutAlt className="ml-2" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('profile');
  const [user, setUser] = useState<User | null>(null);
  const [userRequests, setUserRequests] = useState<DocumentRequest[]>([]);
  const [userDocuments, setUserDocuments] = useState<HistoricalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = usersApi.isAuthenticated();
      if (!isAuthenticated) {
        toast.error('يجب تسجيل الدخول للوصول إلى صفحة الملف الشخصي');
        router.push('/login');
        return;
      }
      
      const userData = usersApi.getCurrentUser();
      if (userData) {
        setUser(userData);
        
        // Fetch user's document requests
        try {
          const requestsResult = await documentRequestApi.getByUserId(userData.id);
          if (requestsResult.success && requestsResult.data) {
            setUserRequests(requestsResult.data);
          }
        } catch (error) {
          console.error('Error fetching document requests:', error);
        }
        
        // Fetch user's documents
        try {
          const documentsResult = await documentsApi.getFiltered(
            { author: userData.id },
            1,
            100,
            'createdDesc'
          );
          if (documentsResult.success && documentsResult.data) {
            setUserDocuments(documentsResult.data.items);
          }
        } catch (error) {
          console.error('Error fetching user documents:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    usersApi.logout();
    toast.success('تم تسجيل الخروج بنجاح');
    router.push('/');
  };

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">جاري تحميل الملف الشخصي...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            الملف <span className="text-primary">الشخصي</span>
          </h1>
          
          {user && (
            <div className="mx-auto max-w-6xl">
              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-center">
                  <li className="mr-2">
                    <button
                      onClick={() => setCurrentTab('profile')}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                        currentTab === 'profile'
                          ? 'border-b-2 border-primary text-primary active'
                          : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <FaUser className="ml-2 h-4 w-4" />
                      الملف الشخصي
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => setCurrentTab('requests')}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                        currentTab === 'requests'
                          ? 'border-b-2 border-primary text-primary active'
                          : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <FaClipboardList className="ml-2 h-4 w-4" />
                      طلبات الوثائق
                      {userRequests.length > 0 && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs font-medium text-white">
                          {userRequests.length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => setCurrentTab('documents')}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                        currentTab === 'documents'
                          ? 'border-b-2 border-primary text-primary active'
                          : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <FaFileAlt className="ml-2 h-4 w-4" />
                      وثائقي
                      {userDocuments.length > 0 && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs font-medium text-white">
                          {userDocuments.length}
                        </span>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Tab content */}
              <div className="py-4">
                {currentTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
                {currentTab === 'requests' && <DocumentRequestsTab requests={userRequests} />}
                {currentTab === 'documents' && <UserDocumentsTab documents={userDocuments} />}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
} 