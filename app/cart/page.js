'use client';

import { useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login?callbackUrl=/cart');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useEffect will redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6 text-white">Sepetim</h1>

      {cart.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 mt-4 text-lg">Sepetiniz boş</p>
          <Link 
            href="/products"
            className="mt-6 inline-block px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Ürünler</h2>
              </div>
              
              {/* Mobile: 2x2 Grid, Desktop: List */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3 p-4">
                  {cart.map(item => (
                    <div key={item.productId + '-' + item.size} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="relative w-full aspect-square mb-3 rounded-md overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="(max-width: 768px) 50vw, 200px"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Görsel yok</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </h3>
                        
                        <p className="text-sm text-pink-600 font-semibold">
                          {item.price.toFixed(2)} TL
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                              disabled={item.quantity <= 1}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded w-6 h-6 flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="text-xs text-gray-700 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                              className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded w-6 h-6 flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <p className="text-xs font-semibold text-gray-700">
                          Toplam: {(item.price * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: List View */}
              <ul className="divide-y divide-gray-200 hidden md:block">
                {cart.map(item => (
                  <li key={item.productId + '-' + item.size} className="p-4">
                    <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4">
                      <div className="flex-shrink-0 w-full md:w-24 aspect-[1/1] min-w-0 min-h-0 relative rounded-md overflow-hidden mb-4 md:mb-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="(max-width: 768px) 100vw, 96px"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Görsel yok</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900">
                          {item.productName}
                        </p>
                        
                        <p className="text-md text-pink-600 font-semibold mt-1">
                          {item.price.toFixed(2)} TL
                        </p>
                        
                        <div className="flex items-center mt-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                            disabled={item.quantity <= 1}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="mx-4 text-gray-700 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                            className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <p className="font-semibold text-lg text-gray-700 mb-2">
                          {(item.price * item.quantity).toFixed(2)} TL
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Sipariş Özeti</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-black">Ürün Sayısı:</span>
                    <span className="text-black">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-3">
                    <span className="text-black">Toplam:</span>
                    <span className="text-black">{totalPrice.toFixed(2)} TL</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Link 
                    href="/checkout" 
                    className="w-full block text-center py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md shadow-sm"
                  >
                    Ödemeye Geç
                  </Link>
                  
                  <button 
                    onClick={clearCart}
                    className="w-full block text-center py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md"
                  >
                    Sepeti Temizle
                  </button>
                  
                  <Link 
                    href="/products" 
                    className="w-full block text-center py-2 px-4 text-pink-600 hover:underline font-medium"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
