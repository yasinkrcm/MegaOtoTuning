'use client';

import { useEffect, useState } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';

export default function IbanSettingsPage() {
  const [form, setForm] = useState({ bankName: '', accountHolder: '', iban: '' });
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
        <h1 className="text-2xl font-bold mb-6">IBAN Bilgileri Güncelle</h1>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white-700">Banka</label>
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700">Hesap Sahibi</label>
              <input
                type="text"
                name="accountHolder"
                value={form.accountHolder}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700">IBAN</label>
              <input
                type="text"
                name="iban"
                value={form.iban}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Başarıyla güncellendi!</p>}
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}
      </div>
    </AdminProtectedRoute>
  );
} 