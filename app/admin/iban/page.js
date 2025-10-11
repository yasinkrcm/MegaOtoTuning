'use client';

import { useEffect, useState } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';

export default function IbanSettingsPage() {
  const [form, setForm] = useState({ bankName: '', accountHolder: '', iban: '', ibanEnabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setForm({
          bankName: data.bankName || '',
          accountHolder: data.accountHolder || '',
          iban: data.iban || '',
          ibanEnabled: data.ibanEnabled !== undefined ? data.ibanEnabled : true,
        });
      } catch (err) {
        setError('Ayarlar yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = async (e) => {
    e.preventDefault(); // Form submit'i engelle
    const newState = !form.ibanEnabled;
    setError(null); // Önceki hataları temizle
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bankName: form.bankName,
          accountHolder: form.accountHolder,
          iban: form.iban,
          ibanEnabled: newState 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Güncelleme başarısız');
      }
      
      setForm({ ...form, ibanEnabled: newState });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`Durum güncellenemedi: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Güncelleme başarısız');
      setSuccess(true);
    } catch (err) {
      setError('Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">IBAN / Banka Transferi Ayarları</h1>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            {/* Toggle Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-md border border-pink-100 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${form.ibanEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-6 h-6 ${form.ibanEnabled ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Banka Transferi / Havale
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {form.ibanEnabled ? (
                          <span className="flex items-center space-x-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Müşteriler manuel havale ile ödeme yapabilir</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                            <span>Bu ödeme yöntemi müşterilere gösterilmez</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 shadow-lg ${
                    form.ibanEnabled ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span className="sr-only">Banka transferi durumu</span>
                  <span
                    className={`pointer-events-none relative inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${
                      form.ibanEnabled ? 'translate-x-10' : 'translate-x-0'
                    }`}
                  >
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                        form.ibanEnabled ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 12 12">
                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                        form.ibanEnabled ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
              
              {form.ibanEnabled && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Checkout sayfasında "Banka Transferi (Manuel)" seçeneği görünür</span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Banka</label>
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className="mt-1 block w-full text-black px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Hesap Sahibi</label>
              <input
                type="text"
                name="accountHolder"
                value={form.accountHolder}
                onChange={handleChange}
                className="mt-1 block w-full text-black px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">IBAN</label>
              <input
                type="text"
                name="iban"
                value={form.iban}
                onChange={handleChange}
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">Başarıyla güncellendi!</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'IBAN Bilgilerini Kaydet'}
              </button>
            </form>
          </>
        )}
      </div>
    </AdminProtectedRoute>
  );
} 