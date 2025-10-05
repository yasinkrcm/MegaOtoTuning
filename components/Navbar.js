'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import NavbarClient from './NavbarClient';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { user, loading } = useAuth();
  
  // Don't render anything until we know the auth status
  if (loading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/logo.jpg" alt="Mega Oto Tuning Logo" width={48} height={48} className="h-12 w-12 object-contain rounded-full" priority />
                  <span className="text-xl font-bold text-red-600">Mega Oto Tuning</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/" 
                  className="border-transparent text-metallic hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Ana Sayfa
                </Link>
                <Link 
                  href="/products" 
                  className="border-transparent text-metallic hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Ürünler
                </Link>
                <Link 
                  href="/about" 
                  className="border-transparent text-metallic hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Hakkımızda
                </Link>
                <Link 
                  href="/contact" 
                  className="border-transparent text-metallic hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  İletişim
                </Link>
              </div>
            </div>
            
            {/* Loading state for auth section */}
            <div className="hidden sm:flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            </div>
            
            <div className="flex items-center sm:hidden">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="bg-gray shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.jpg" alt="Mega Oto Tuning Logo" width={48} height={48} className="h-12 w-12 object-contain rounded-full" priority />
                <span className="text-xl font-bold text-red-600">Mega Oto Tuning</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ">
              <Link 
                href="/" 
                className="border-transparent text-white-500 hover:border-pink-500 hover:text-pink-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/products" 
                className="border-transparent text-white-500 hover:border-pink-500 hover:text-pink-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Ürünler
              </Link>
              <Link 
                href="/about" 
                className="border-transparent text-white-500 hover:border-pink-500 hover:text-pink-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Hakkımızda
              </Link>
              <Link 
                href="/contact" 
                className="border-transparent text-white-500 hover:border-pink-500 hover:text-pink-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                İletişim
              </Link>
              
              {/* Bilgi Sayfaları Dropdown */}
              <div className="relative group">
                <button className="border-transparent text-white-500 hover:border-pink-500 hover:text-pink-700 inline-flex items-center px-0.5 pt-1 border-b-2 text-xs font-medium">
                  Bilgi
                  <svg className="ml-0.5 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link 
                      href="/delivery" 
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Teslimat Koşulları
                    </Link>
                    <Link 
                      href="/sales-policy" 
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Satış Politikası
                    </Link>
                    <Link 
                      href="/distance-sales-agreement" 
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Mesafeli Satış Sözleşmesi
                    </Link>
                    <Link 
                      href="/return-policy" 
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      İptal ve İade Prosedürü
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex items-center">
            <NavbarClient user={user} />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
