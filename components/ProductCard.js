'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { useState } from 'react';

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();

  return (
    <div className={`bg-gray-100 rounded-2xl shadow-lg ${compact ? 'p-1 sm:p-2 min-h-[180px] sm:min-h-[220px]' : 'p-3 sm:p-6 min-h-[320px] sm:min-h-[420px]'} relative border border-gray-200 w-full min-w-0 sm:min-w-[200px]`}>
      {/* Hızlı Teslimat etiketi */}
      <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10`}>
        <span className={`bg-green-500 text-white ${compact ? 'text-[10px] sm:text-xs px-1 sm:px-2 py-0.5' : 'text-xs sm:text-sm px-2 sm:px-3 py-1'} font-bold rounded`}>HIZLI TESLİMAT</span>
      </div>
      {/* ürün görseli */}
      <div className={`relative w-full ${compact ? 'aspect-square mb-1 sm:mb-2' : 'aspect-square md:aspect-[4/3] mb-3 sm:mb-4'} overflow-hidden rounded-xl`}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center w-full h-full"
            priority={false}
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-xl text-center">
            <span className={`text-gray-400 ${compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}`}>Resim yok</span>
          </div>
        )}
      </div>
      {/* ürün başlığı ve açıklama */}
      <div className={`${compact ? 'px-0.5 sm:px-1' : 'px-1 sm:px-2'} flex flex-col justify-between`}>
        <div>
          <h3 className={`font-bold ${compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'} inline`}>{product.brand || ''}</h3>
          <span className={`${compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'} text-gray-700`}> {product.name}</span>
          <div className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-base'} text-gray-500 mt-1 sm:mt-2 truncate`}>{product.category}</div>
        </div>
        {/* Fiyat */}
        <div className={`text-red-600 font-bold ${compact ? 'text-base sm:text-lg mt-1 sm:mt-2' : 'text-lg sm:text-2xl mt-2 sm:mt-4'} px-1`}>{product.price} TL</div>
        {/* İndirim etiketi */}
        {product.discount && (
          <div className={`bg-orange-100 text-orange-700 ${compact ? 'text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 mt-1 sm:mt-2' : 'text-xs sm:text-base px-2 sm:px-3 py-1 mt-2 sm:mt-3'} font-semibold rounded flex items-center w-max mx-auto`}>
            <svg width="12" height="12" fill="currentColor" className="mr-1"><circle cx="6" cy="6" r="6"/></svg>
            {product.discount} İndirim
          </div>
        )}
        <div className={`${compact ? 'mt-2 sm:mt-3' : 'mt-3 sm:mt-5'} flex items-center justify-between`}>
          <div className={`${compact ? 'space-x-1 sm:space-x-2' : 'space-x-2 sm:space-x-3'} flex`}>
            <button
              onClick={() => addToCart(product, 1)}
              className={`${compact ? 'px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm' : 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base'} bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors`}
              aria-label="Sepete Ekle"
              title="Sepete Ekle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5 sm:h-6 sm:w-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <Link
              href={`/products/${product._id}`}
              className={`${compact ? 'px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm' : 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base'} bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors`}
            >
              İncele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
