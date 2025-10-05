'use client';

import { useState } from 'react';

export function OrderStatusUpdate({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || 'iletildi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cargoCompany, setCargoCompany] = useState('');
  const [cargoTrackingNumber, setCargoTrackingNumber] = useState('');
  const [pendingStatus, setPendingStatus] = useState(status);
  
  const statuses = [
    'iletildi',
    'hazırlanıyor',
    'kargoya verildi',
    'ulaştı',
    'iptal edildi'
  ];

  const cargoCompanies = [
    'Sürat Kargo',
    'Aras Kargo'
  ];
  
  const handleStatusSelect = (e) => {
    setPendingStatus(e.target.value);
  };

  const handleCargoCompanySelect = (e) => {
    setCargoCompany(e.target.value);
  };
  
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let body = { status: pendingStatus };
      if (pendingStatus === 'kargoya verildi') {
        body.cargoCompany = cargoCompany;
        body.cargoTrackingNumber = cargoTrackingNumber;
      }
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Sipariş durumu güncellenemedi (${res.status})`);
      }
      
      setStatus(pendingStatus);
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
      <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
        Durumu Güncelle:
      </label>
      <div className="flex items-center gap-2">
        <select
          id="status-select"
          value={pendingStatus}
          onChange={handleStatusSelect}
          disabled={loading}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
        >
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </option>
          ))}
        </select>
        
        {loading && (
          <span className="ml-3 text-sm text-gray-500">Güncelleniyor...</span>
        )}
      </div>
      
      {pendingStatus === 'kargoya verildi' && (
        <div className="mt-2 space-y-2">
          <select
            value={cargoCompany}
            onChange={handleCargoCompanySelect}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Kargo Şirketi Seçin</option>
            {cargoCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Kargo Takip Numarası"
            value={cargoTrackingNumber}
            onChange={e => setCargoTrackingNumber(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || !cargoCompany || !cargoTrackingNumber}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading || !cargoCompany || !cargoTrackingNumber ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}
          >
            Onayla
          </button>
        </div>
      )}
      
      {pendingStatus !== 'kargoya verildi' && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}
        >
          Onayla
        </button>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-green-600">Sipariş durumu başarıyla güncellendi!</p>
      )}
    </div>
  );
}
