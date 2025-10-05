'use client';

import { useEffect, useState } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) throw new Error('Loglar getirilemedi');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Loglar</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Tip</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Bildirim</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Detay</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-200 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-black font-bold">
                        {log.type === 'order' ? 'Sipariş' : 
                         log.type === 'payment' ? 'Ödeme' : 
                         log.type === 'user' ? 'Üye' : 
                         log.type}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-normal break-words max-w-xs text-black">{log.message.replace(/\([^)]+\)/g, '')}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-black">{new Date(log.createdAt).toLocaleString('tr-TR')}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-normal break-words max-w-xs text-black">
                        {log.type === 'order' || log.type === 'payment' ? (
                          <div>
                            <div><span className="font-semibold text-black">Ürün:</span> {log.data?.items ? log.data.items.map(i => i.productName).join(', ') : log.data?.productName}</div>
                            <div><span className="font-semibold text-black">Tutar:</span> {log.data?.totalAmount ? log.data.totalAmount + ' TL' : ''}</div>
                            <div><span className="font-semibold text-black">Ödeme:</span> {log.data?.isPaid === true ? 'Yapıldı' : log.data?.isPaid === false ? 'Yapılmadı' : ''}</div>

                          </div>
                        ) : log.type === 'user' ? (
                          <div>
                            <div><span className="font-semibold text-black">Ad:</span> {log.data?.name}</div>
                            <div><span className="font-semibold text-black">E-posta:</span> {log.data?.email}</div>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </AdminProtectedRoute>
  );
} 