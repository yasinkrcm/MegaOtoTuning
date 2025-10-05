'use client';

import { useCart } from './CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Cart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    clearCart
  } = useCart();

  return (
    <>
      {/* Cart Sidebar Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity" 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between px-4 py-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Sepetim</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Sepeti kapat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto py-4 px-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 mt-4">Sepetiniz boş</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-pink-600 font-medium hover:underline"
                >
                  Alışverişe Devam Et
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map(item => (
                  <li key={item.productId + '-' + item.size} className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Görsel yok</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-pink-600 font-semibold">
                          {item.price.toFixed(2)} TL
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                            disabled={item.quantity <= 1}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="mx-2 text-gray-700 w-6 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-black">Ürün Sayısı:</span>
                <span className="text-black">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/checkout" 
                  className="w-full block text-center py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md shadow-sm"
                  onClick={() => setIsCartOpen(false)}
                >
                  Ödemeye Geç
                </Link>
                
                <button 
                  onClick={clearCart}
                  className="w-full block text-center py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md"
                >
                  Sepeti Temizle
                </button>
              </div>
              <span className="text-black font-bold text-lg border-t border-gray-200 pt-3 mt-3">Toplam:</span>
              <span className="text-black">{totalPrice.toFixed(2)} TL</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
