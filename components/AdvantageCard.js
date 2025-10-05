import Image from 'next/image';

export default function AdvantageCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow p-3 relative border border-gray-100 w-64">
      {/* Etiketler */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">HIZLI TESLİMAT</span>
        <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full mt-1">EN ÇOK SATAN</span>
      </div>
      {/* Favori */}
      <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-pink-500">
          <path d="M16.5 3.5a4.5 4.5 0 0 0-6.36 0L10 4.36l-.14-.14A4.5 4.5 0 1 0 3.5 10c0 2.5 2.5 4.5 6.36 8.14a1 1 0 0 0 1.28 0C18 14.5 20.5 12.5 20.5 10a4.5 4.5 0 0 0-4-6.5z"/>
        </svg>
      </button>
      {/* Ürün görseli */}
      <div className="flex justify-center items-center mt-6 mb-2 h-36">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={120}
          height={120}
          className="object-contain max-h-36"
        />
      </div>
      {/* Ürün başlığı ve açıklama */}
      <div className="px-1">
        <h3 className="font-bold text-sm inline">{product.brand || "BeeSafe"}</h3>
        <span className="text-sm text-gray-700"> {product.name.replace(product.brand, '')}</span>
        <div className="text-xs text-gray-500 mt-1 truncate">{product.shortDesc || "Doğal Kene Ve Sivrisinek Koruyucu Sprey..."}</div>
      </div>
      {/* Puan, yorum, ikonlar */}
      <div className="flex items-center gap-1 mt-2 px-1">
        <span className="text-yellow-400 text-sm">★</span>
        <span className="text-sm font-semibold">{product.rating || "4.3"}</span>
        <span className="text-xs text-gray-500">({product.reviewCount || "1127"})</span>
        {/* İkon örneği */}
        <span className="ml-2 text-gray-400">
          <svg width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="8"/></svg>
        </span>
      </div>
      {/* Fiyat */}
      <div className="text-pink-600 font-bold text-xl mt-2 px-1">{product.price ? product.price + " TL" : "212,05 TL"}</div>
      {/* Alt avantaj etiketi */}
      <div className="bg-orange-100 text-orange-700 text-xs font-semibold rounded px-2 py-1 mt-2 flex items-center w-max mx-auto">
        <svg width="16" height="16" fill="currentColor" className="mr-1"><circle cx="8" cy="8" r="8"/></svg>
        2. Ürün %40
      </div>
    </div>
  );
} 