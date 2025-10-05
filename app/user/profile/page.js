'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

import Link from 'next/link';
import OrdersButton from '../../../components/OrdersButton';

export default function UserProfile() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  // Client-side olduğumuzdan emin ol
  useEffect(() => {
    setIsClient(true);
    setLoading(false);
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
    router.push('/');
  };

  if (!isClient || loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Oturum Açın</h1>
        <p className="mb-4 text-gray-600">Profilinizi görüntülemek için lütfen oturum açın.</p>
        <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-8">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-pink-100">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                      Yönetici
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Hesap Bilgileri</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-black">Ad Soyad:</span>
                        <span className="font-medium text-black">{user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">E-posta:</span>
                        <span className="font-medium text-black">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Hesap Türü:</span>
                        <span className="font-medium text-black">{user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="px-6 pb-8">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-black">İşlemler</h3>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/user/orders"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors relative"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <OrdersButton />
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Yönetim Paneli
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
