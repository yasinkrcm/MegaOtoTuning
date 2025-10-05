'use client';

import Link from 'next/link';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';
import Toast from '../../components/Toast';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [toastMsg, setToastMsg] = useState('');
  const [lastLogId, setLastLogId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchLatestLog() {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0 && data[0]._id !== lastLogId) {
          if (lastLogId !== null) setToastMsg(data[0].message.replace(/\([^)]+\)/g, ''));
          setLastLogId(data[0]._id);
        }
      } catch {}
    }
    fetchLatestLog();
    const interval = setInterval(fetchLatestLog, 2000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [lastLogId]);

  return (
    <AdminProtectedRoute>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Link 
                href="/admin/products" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Ürün Yönetimi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ürünleri ekle, düzenle ve yönet
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/admin/users" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Kullanıcı Yönetimi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Kullanıcıları görüntüle ve yönet
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/admin/orders" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Sipariş Yönetimi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Siparişleri görüntüle ve durumlarını güncelle
                    </p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/admin/iban" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">IBAN Yönetimi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Banka/IBAN bilgilerini güncelle
                    </p>
                  </div>
                </div>
              </Link>
              <Link 
                href="/admin/logs" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Loglar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tüm sistem olay geçmişini görüntüle
                    </p>
                  </div>
                </div>
              </Link>
              


              <Link 
                href="/admin/settings" 
                className="bg-white overflow-hidden shadow rounded-lg border border-pink-100 p-6 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">PayTR Ayarları</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      PayTR ayarlarını görüntüle ve yönet
                    </p>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
