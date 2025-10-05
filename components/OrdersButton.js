'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function OrdersButton() {
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const { user, authenticatedFetch } = useAuth();
  
  useEffect(() => {
    const fetchPendingVerifications = async () => {
      if (!user) {
        setPendingVerifications(0);
        return;
      }

      try {
        const response = await authenticatedFetch('/api/orders');
        const orders = await response.json();
        
        // Kredi kartı ödemeli, ödenmemiş ve henüz doğrulanmamış siparişleri say
        const pending = orders.filter(order => 
          order.paymentMethod === 'Kredi Kartı' && 
          !order.isPaid &&
          !order.isVerified
        ).length;
        
        setPendingVerifications(pending);
      } catch (error) {
        console.error('Error fetching pending verifications:', error);
        setPendingVerifications(0);
      }
    };

    fetchPendingVerifications();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchPendingVerifications, 30000);
    
    return () => clearInterval(interval);
  }, [user, authenticatedFetch]);
  
  return (
    <div className="relative inline-flex items-center">
      <span>Siparişlerim</span>
      {pendingVerifications > 0 && (
        <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {pendingVerifications}
        </span>
      )}
    </div>
  );
} 