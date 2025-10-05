'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import OrderStatus from '../../../components/OrderStatus';
import { useAuth } from '../../../components/AuthContext';
import Toast from '../../../components/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const { user, authenticatedFetch, loading: authLoading } = useAuth();
  const [toastMsg, setToastMsg] = useState('');
  const [lastOrderIds, setLastOrderIds] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [ordersResponse, usersResponse] = await Promise.all([
        authenticatedFetch('/api/orders'),
        authenticatedFetch('/api/users'),
      ]);

      const ordersData = await ordersResponse.json();
      const usersData = await usersResponse.json();

      setOrders(ordersData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, fetchData]);

  // 2 sn'de bir otomatik fetch
  useEffect(() => {
    if (!authLoading && user) {
      const interval = setInterval(() => {
        fetchData();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [authLoading, user, fetchData]);

  // Yeni sipariş bildirimi
  useEffect(() => {
    if (orders.length > 0) {
      const currentIds = orders.map(o => o._id);
      if (lastOrderIds.length > 0 && currentIds.some(id => !lastOrderIds.includes(id))) {
        setToastMsg('Yeni sipariş geldi!');
      }
      setLastOrderIds(currentIds);
    }
  }, [orders]);

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      const response = await authenticatedFetch(`/api/orders?orderId=${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOrders(orders.filter(order => order._id !== orderId));
        setToastMsg('Sipariş başarıyla silindi');
      } else {
        const errorData = await response.json();
        setToastMsg(`Hata: ${errorData.error}`);
      }
    } catch (err) {
      setToastMsg(`Hata: ${err.message}`);
    } finally {
      setDeletingOrder(null);
    }
  };

  if (authLoading || !user) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Siparişler yükleniyor...</p>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Hata: {error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  const userMap = {};
  users.forEach(user => {
    userMap[user._id] = user.name;
  });

  return (
    <AdminProtectedRoute>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-4 sm:px-0">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş ID</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödeme Yöntemi</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödeme</th>
                          <th className="relative px-2 sm:px-6 py-2 sm:py-3"><span className="sr-only">İşlemler</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order._id.substring(0, 8)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.customerName || userMap[order.userId] || 'Bilinmeyen Müşteri'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">₺{order.totalAmount.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                  order.paymentMethod === 'Kredi Kartı' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.paymentMethod || 'Banka Transferi'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <OrderStatus status={order.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.isPaid ? (
                                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Ödendi</span>
                                ) : (
                                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">Bekliyor</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Link href={`/admin/orders/${order._id}`} className="text-pink-600 hover:text-pink-900">
                                  Detay
                                </Link>
                                <button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  disabled={deletingOrder === order._id}
                                  className={`text-red-600 hover:text-red-900 ${
                                    deletingOrder === order._id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {deletingOrder === order._id ? 'Siliniyor...' : 'Sil'}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              Henüz sipariş bulunmuyor
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
