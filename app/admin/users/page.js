'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import UserBanButton from '../../../components/UserBanButton';
import { useAuth } from '../../../components/AuthContext';
import Toast from '../../../components/Toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, authenticatedFetch, loading: authLoading } = useAuth();
  const [toastMsg, setToastMsg] = useState('');
  const [lastUserIds, setLastUserIds] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers();
    }
  }, [user, authLoading, fetchUsers]);

  useEffect(() => {
    if (!authLoading && user) {
      const interval = setInterval(() => {
        fetchUsers();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [authLoading, user, fetchUsers]);

  useEffect(() => {
    if (users.length > 0) {
      const currentIds = users.map(u => u._id);
      if (lastUserIds.length > 0 && currentIds.some(id => !lastUserIds.includes(id))) {
        setToastMsg('Yeni üye kaydoldu!');
      }
      setLastUserIds(currentIds);
    }
  }, [users]);

  if (authLoading || !user) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Kullanıcılar yükleniyor...</p>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Hata: {error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-4 sm:px-0">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Üyelik Tarihi</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KVKK</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                          <th className="relative px-2 sm:px-6 py-2 sm:py-3"><span className="sr-only">İşlemler</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.kvkkConsent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.kvkkConsent ? 'Onaylı' : 'Onaysız'}
                              </span>
                              {user.kvkkConsentDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(user.kvkkConsentDate).toLocaleDateString('tr-TR')}
                                </div>
                              )}
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                !user.isBanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {!user.isBanned ? 'Aktif' : 'Engellendi'}
                              </span>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                              <Link href={`/admin/users/${user._id}`} className="text-pink-600 hover:text-pink-900 mr-3">
                                Detay
                              </Link>
                              <Link href={`/admin/users/edit/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                Düzenle
                              </Link>
                              <UserBanButton user={user} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
