'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function MobileCartButton() {
  const { totalItems } = useCart();
  
  return (
    <Link 
      href="/cart"
      className="fixed bottom-6 right-20 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors z-50 sm:hidden"
      aria-label="Sepetim"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
} 