'use client';

import { useRouter } from 'next/navigation';

export default function PaymentFailed() {
  const router = useRouter();

  const handleNavigate = (path) => {
    try {
      // Önce router.push deneyin
      if (router && typeof router.push === 'function') {
        router.push(path);
      } else {
        // Router çalışmıyorsa window.location.href kullanın
        window.location.href = path;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Hata durumunda window.location.href kullanın
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödeme Başarısız</h2>
        <p className="text-gray-600 mb-8">
          Üzgünüz, ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz veya farklı bir ödeme yöntemi seçiniz.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => handleNavigate('/checkout')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => handleNavigate('/cart')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Sepete Dön
          </button>
        </div>
      </div>
    </div>
  );
}
