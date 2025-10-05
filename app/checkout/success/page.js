'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../components/CartContext';

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentMethod = searchParams.get('payment_method');
    
    // Sadece PayTR dışındaki ödemelerde sepeti temizle
    if (paymentMethod !== 'paytr') {
      clearCart();
    }
  }, [clearCart]);

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödeme Başarılı!</h2>
        <p className="text-gray-600 mb-8">
          Siparişiniz başarıyla oluşturuldu. Siparişinizin durumunu "Siparişlerim" sayfasından takip edebilirsiniz.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => handleNavigate('/user/orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Siparişlerimi Görüntüle
          </button>
          <button
            onClick={() => handleNavigate('/products')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
