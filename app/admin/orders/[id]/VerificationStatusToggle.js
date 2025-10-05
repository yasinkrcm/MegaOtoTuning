'use client';

import { useState } from 'react';

export default function VerificationStatusToggle({ orderId, initialIsVerified, onStatusChange }) {
  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [loading, setLoading] = useState(false);

  const toggleVerificationStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !isVerified,
        }),
      });

      if (response.ok) {
        setIsVerified(!isVerified);
        // Eğer callback varsa çağır
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        alert('Doğrulama durumu güncellenemedi.');
      }
    } catch (error) {
      console.error('Error toggling verification status:', error);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleVerificationStatus}
      disabled={loading}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
        isVerified
          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <span className={`inline-block w-2 h-2 mr-2 rounded-full ${isVerified ? 'bg-white' : 'bg-white'}`}></span>
          {isVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
        </>
      )}
    </button>
  );
} 