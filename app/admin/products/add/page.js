'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/AuthContext';
import Image from 'next/image';
import AdminProtectedRoute from '../../../../components/AdminProtectedRoute';

// Cloudinary upload helper
async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  formData.append('timestamp', Math.floor(Date.now() / 1000));
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Cloudinary yükleme hatası');
  }
  const data = await response.json();
  return data.secure_url;
}

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    inStock: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { user, authenticatedFetch, loading: authLoading } = useAuth();
  
  // Show loading if auth is still loading or user is not available
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Resim dosyası 5MB\'dan küçük olmalıdır.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress(30);
      try {
        const url = await uploadToCloudinary(file);
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setUploadProgress(100);
      } catch (err) {
        setError('Görsel Cloudinary\'e yüklenemedi: ' + err.message);
        setUploadProgress(0);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate price as a number
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Lütfen geçerli bir fiyat giriniz.');
      }
      
      // Validate that at least one size has stock
      // const totalStock = formData.sizes.reduce((sum, size) => sum + size.stock, 0);
      // if (totalStock === 0) {
      //   throw new Error('En az bir beden için stok miktarı giriniz.');
      // }
      
      // Format the data
      const productData = {
        ...formData,
        price: priceValue,
        // inStock: totalStock > 0 // This line is removed as per the edit hint
      };
      
      await authenticatedFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      
      // Redirect to product list on success
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-white">
        <header className="bg-pink-100 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6 max-w-3xl mx-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 text-black"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 text-black"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 text-black"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category || 'Aksesuar'}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 text-black"
                  >
                    <option value="Aksesuar">Aksesuar</option>
                    <option value="Parça">Parça</option>
                  </select>
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ürün Fotoğrafı
                </label>
                
                {/* Production Notice */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Not:</strong> Canlı ortamda dosya yükleme kullanılamıyor. Lütfen resim URL'si kullanın.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* File Upload */}
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-md border border-black transition-colors">
                      <span className="text-sm font-medium">Fotoğraf Seç</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    
                    {selectedFile && (
                      <span className="text-sm text-gray-600">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Önizleme:</p>
                      <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Manual URL Input */}
                  <div className="mt-4">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Veya Resim URL'si
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 text-black"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Dosya yüklemezseniz URL ile resim ekleyebilirsiniz
                    </p>
                  </div>
                  
                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Resim yükleniyor... %{uploadProgress}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Size and Stock Management */}
              {/* This section is removed as per the edit hint */}
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="px-4 py-2 border border-black rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600`}
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
