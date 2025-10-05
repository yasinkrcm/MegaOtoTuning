'use client';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminProtectedRoute({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Client-side olduğumuzdan emin ol
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Client-side'da değilsek bir şey yapma
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    setIsLoading(false);
  }, [user, loading, router, isClient]);

  // Server-side render sırasında loading göster
  if (!isClient || loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Yükleniyor...</h2>
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Session yoksa veya admin değilse boş döndür (useEffect yönlendirme yapacak)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return children;
}
