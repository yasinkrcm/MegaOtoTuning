'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../components/AuthContext';

export default function PayTRToggle() {
  const { authenticatedFetch } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticatedFetch) {
      fetchPayTRStatus();
    }
  }, [authenticatedFetch]);

  const fetchPayTRStatus = async () => {
    try {
      const response = await authenticatedFetch('/api/paytr-settings');
      const data = await response.json();
      setEnabled(data.paytrEnabled);
      setLoading(false);
    } catch (error) {
      toast.error('PayTR durumu alınamadı');
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/paytr-settings', {
        method: 'PUT',
        body: JSON.stringify({ paytrEnabled: !enabled }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İşlem başarısız');
      }

      setEnabled(!enabled);
      toast.success(enabled ? 'PayTR ödemesi devre dışı bırakıldı' : 'PayTR ödemesi etkinleştirildi');
    } catch (error) {
      toast.error(`PayTR durumu güncellenemedi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium text-black">PayTR Ödeme Sistemi</h3>
        <p className="text-sm text-gray-500">
          {enabled ? 'PayTR ödeme sistemi aktif' : 'PayTR ödeme sistemi devre dışı'}
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          onChange={handleToggle}
          disabled={loading}
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
          ${enabled ? 'peer-checked:after:translate-x-full peer-checked:bg-blue-600' : ''}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
        </div>
      </label>
    </div>
  );
}
