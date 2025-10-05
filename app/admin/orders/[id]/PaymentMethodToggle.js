'use client';

import { useState } from 'react';

export function PaymentMethodToggle({ orderId, initialPaymentMethod }) {
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'Kredi Kartı');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleToggle = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const newPaymentMethod = paymentMethod === 'Kredi Kartı' ? 'Banka Transferi' : 'Kredi Kartı';
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: newPaymentMethod })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Ödeme yöntemi güncellenemedi (${res.status})`);
      }
      
      setPaymentMethod(newPaymentMethod);
      setSuccess(true);
      
      // Refresh the page after successful update
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mb-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-1 text-sm rounded-md ${loading ? 'bg-gray-300 text-gray-700' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
      >
        {loading ? 'Güncelleniyor...' : `Ödeme Yöntemini ${paymentMethod === 'Kredi Kartı' ? 'Banka Transferi' : 'Kredi Kartı'} olarak değiştir`}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-green-600">Ödeme yöntemi başarıyla güncellendi!</p>
      )}
    </div>
  );
}
