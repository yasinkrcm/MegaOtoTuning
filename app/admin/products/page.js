'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import { useAuth } from '../../../components/AuthContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const { user, authenticatedFetch, loading: authLoading } = useAuth();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
  }, [user, authLoading, fetchProducts]);

  const handleDelete = async (productId, productName) => {
    if (!confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      await authenticatedFetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      // Remove product from state
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFeatureToggle = async (productId, currentFeatured) => {
    setDeleteLoading(true);
    try {
      await authenticatedFetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !currentFeatured })
      });
      // Ürünleri tekrar çek
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

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
            <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
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
              onClick={fetchProducts}
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
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
            <Link 
              href="/admin/products/add" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Yeni Ürün Ekle
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 max-w-7xl mx-auto px-4">
            {['Tümü', 'Aksesuar', 'Parça'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1 rounded-full border text-sm font-semibold transition-colors duration-150 ${categoryFilter === cat ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-600 border-pink-300 hover:bg-pink-50'}`}
              >
                {cat}
              </button>
            ))}
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
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Durumu</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başa Sabit</th>
                          <th className="relative px-2 sm:px-6 py-2 sm:py-3"><span className="sr-only">Düzenle</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products
                         .filter(product => categoryFilter === 'Tümü' ? true : product.category === categoryFilter)
                          .map((product) => (
                            <tr key={product._id} className={product.featured ? 'bg-yellow-50' : ''}>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {product.imageUrl && (
                                  <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                    <Image className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} width={40} height={40} />
                                  </div>
                                )}
                                <div className="ml-2 sm:ml-4">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">{product.category}</div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">₺{product.price}</div>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'Stokta' : 'Tükendi'}
                              </span>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleFeatureToggle(product._id, product.featured)}
                                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow transition-all duration-200 border-2 ${product.featured ? 'bg-yellow-400 text-black border-yellow-500 scale-105' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-yellow-200 hover:border-yellow-400'} disabled:opacity-60`}
                                disabled={deleteLoading}
                                title={product.featured ? 'Baştan Kaldır' : 'Başa Sabitle'}
                              >
                                {product.featured ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" width="20" height="20"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" width="20" height="20"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27l6.18 3.73-1.64-7.03L22 9.24z"/></svg>
                                )}
                                {product.featured ? 'Baştan Kaldır' : 'Başa Sabitle'}
                              </button>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                              <Link href={`/admin/products/edit/${product._id}`} className="text-pink-600 hover:text-pink-900 mr-4">
                                Düzenle
                              </Link>
                              <button 
                                onClick={() => handleDelete(product._id, product.name)}
                                disabled={deleteLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {deleteLoading ? 'Siliniyor...' : 'Sil'}
                              </button>
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
