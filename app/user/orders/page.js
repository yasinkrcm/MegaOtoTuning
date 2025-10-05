'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../components/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';
import OrderStatus from '../../../components/OrderStatus';
import { useRouter } from 'next/navigation';

export default function UserOrders() {
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user, authenticatedFetch, loading: authLoading } = useAuth();
  const router = useRouter();

  // Client-side olduğumuzdan emin ol
  useEffect(() => {
    setIsClient(true);
    
    // Query parametrelerini kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // URL'yi temizle
      router.replace('/user/orders', undefined, { shallow: true });
      // 5 saniye sonra mesajı gizle
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }

  }, [router]);

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/orders');
      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserOrders();
    }
  }, [user, authLoading, fetchUserOrders]);

  const handleMarkAsPaid = async (orderId) => {
    try {
      await authenticatedFetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: true })
      });
      // Siparişler listesini güncelle
      setOrders(orders => orders.map(order => order._id === orderId ? { ...order, isPaid: true } : order));
    } catch (err) {
      alert('Ödeme bildirilemedi. Lütfen tekrar deneyin.');
    }
  };



  if (!isClient || loading) {
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
        <p className="mb-4 text-gray-600">Siparişlerinizi görüntülemek için lütfen oturum açın.</p>
        <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Hata</h1>
        <p className="mb-4 text-gray-600">{error}</p>
        <button 
          onClick={fetchUserOrders}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Messages */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Siparişiniz başarıyla oluşturuldu!</p>
                <p className="text-sm">Siparişinizin durumunu bu sayfadan takip edebilirsiniz.</p>
              </div>
            </div>
          </div>
        )}
        

        
        <h1 className="text-2xl font-bold mb-8">Siparişlerim</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Henüz siparişiniz bulunmuyor.</p>
            <Link href="/" className="text-red-600 hover:text-red-800">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-200 border border-gray rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray bg-gray px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Sipariş No: <span className="font-mono">{order._id.substring(0, 8)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                    {order.paymentMethod && (
                      <p className="text-sm text-black mt-1">
                        Ödeme Yöntemi: {order.paymentMethod}
                      </p>
                    )}
                  </div>
                  <OrderStatus status={order.status} />
                </div>
                {order.status === 'kargoya verildi' && (order.cargoCompany || order.cargoTrackingNumber) && (
                  <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-800 font-medium">Kargo Şirketi: <span className="font-normal">{order.cargoCompany || '-'}</span></p>
                    <p className="text-sm text-blue-800 font-medium">Takip Numarası: <span className="font-normal">{order.cargoTrackingNumber || '-'}</span></p>
                  </div>
                )}
                <ul className="divide-y divide-black">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId}-${index}`} className="px-4 py-4 sm:px-6 flex items-center">
                      {item.imageUrl && (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.productName} 
                          className="h-16 w-16 rounded-md object-cover mr-4"
                          width={64}
                          height={64}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-black">{item.productName}</p>
                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">₺{item.price}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-medium text-gray-900">Toplam</p>
                      <p className="font-medium text-gray-900">₺{order.totalAmount}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.isPaid ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Ödeme yapıldı</span>
                      ) : (
                        <>
                          {/* Ödeme Yaptım butonu sadece Banka Transferi için göster */}
                          {order.paymentMethod === 'Banka Transferi' && (
                            <button
                              onClick={() => handleMarkAsPaid(order._id)}
                              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                            >
                              Ödeme Yaptım
                            </button>
                          )}
                          

                        </>
                      )}
                    </div>
                  </div>
                  

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
