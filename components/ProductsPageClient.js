"use client";
import { useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function ProductsPageClient({ products, error }) {
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const filteredProducts = categoryFilter === 'Tümü' ? products : products.filter(p => p.category === categoryFilter);
  const featuredProducts = filteredProducts.filter(p => p.featured);
  const otherProducts = filteredProducts.filter(p => !p.featured);
  return (
    <main className="max-w-screen-2xl mx-auto px-1 sm:px-2 lg:px-4 py-8 bg-dark">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-red-700">Ürünler</h1>
        <p className="text-metallic">Özel tasarım, şık ve modern tuning ürünleriyle aracınızı kişiselleştirin.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {featuredProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-6 animate-bounce">Öne Çıkanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <div key={product._id} className="border-2 sm:border-4 border-yellow-400 rounded-xl shadow-xl scale-100 sm:scale-105 bg-white p-1 sm:p-2 animate-pulse">
                <ProductCard product={product} compact={true} />
              </div>
            ))}
          </div>
        </section>
      )}
      {otherProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {otherProducts.map(product => (
            <ProductCard key={product._id} product={product} compact={true} />
          ))}
        </div>
      ) : !error && featuredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Henüz ürün bulunmuyor.</p>
          <p className="text-sm text-gray-400">Lütfen daha sonra tekrar kontrol edin.</p>
        </div>
      ) : null}
      <div className="mt-12 p-6 bg-metallic rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-red-700">Alışveriş Bilgileri</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-red-600 mr-2">✓</span>
            <span>Siparişleriniz 2-4 iş günü içinde kargoya verilir.</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">✓</span>
            <span>İade ve değişim için 14 gün süreniz bulunmaktadır.</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">✓</span>
            <span>Detaylı bilgi için <Link href="/contact" className="text-blue-600 underline">iletişim</Link> sayfasına göz atabilirsiniz.</span>
          </li>
        </ul>
      </div>
    </main>
  );
} 