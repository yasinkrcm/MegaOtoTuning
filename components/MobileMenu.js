'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import OrdersButton from './OrdersButton';

export default function MobileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
  };
  
  return (
    <div className="sm:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
        aria-expanded="false"
      >
        <span className="sr-only">Ana menüyü aç</span>
        {!isOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="absolute top-16 inset-x-0 p-2 transition transform origin-top-right z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50 opacity-100">
            <div className="pt-5 pb-6 px-5">
              {/* Ana menü linkleri */}
              <div className="space-y-1">
                <Link 
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link 
                  href="/products"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Ürünler
                </Link>
                <Link 
                  href="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link 
                  href="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  İletişim
                </Link>
                
                {/* Bilgi Sayfaları */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    Bilgi Sayfaları
                  </div>
                  <Link 
                    href="/delivery"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Teslimat Koşulları
                  </Link>
                  <Link 
                    href="/sales-policy"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Satış Politikası
                  </Link>
                  <Link 
                    href="/distance-sales-agreement"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  <Link 
                    href="/return-policy"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    İptal ve İade Prosedürü
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Kullanıcı menüsü */}
            {user ? (
              <div className="pt-5 pb-6 px-5">
                <Link 
                  href="/user/orders"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 relative"
                  onClick={() => setIsOpen(false)}
                >
                  <OrdersButton />
                </Link>
                <Link 
                  href="/user/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Profilim
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={(e) => {
                    setIsOpen(false);
                    handleSignOut(e);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="pt-5 pb-6 px-5">
                <Link 
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
