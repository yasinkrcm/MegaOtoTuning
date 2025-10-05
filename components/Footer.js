import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Şirket Bilgileri */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-pink-400 mb-4">Mega Oto Tuning</h3>
            <p className="text-gray-300 mb-4">
              Aracınızı performans ve tarz açısından geliştirmek için profesyonel oto tuning çözümleri sunuyoruz. 
              Motor ve görsel modifikasyonlarla fark yaratın.
            </p>
            <div className="flex space-x-4">
                             <a href="tel:+905068922453" className="text-gray-300 hover:text-pink-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
              <a href="mailto:info@megaototuning.com" className="text-gray-300 hover:text-pink-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-bold text-pink-400 mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Bilgi Sayfaları */}
          <div>
            <h3 className="text-lg font-bold text-pink-400 mb-4">Bilgi Sayfaları</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/delivery" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Teslimat Koşulları
                </Link>
              </li>
              <li>
                <Link href="/sales-policy" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Satış Politikası
                </Link>
              </li>
              <li>
                <Link href="/distance-sales-agreement" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-300 hover:text-pink-400 transition-colors">
                  İptal ve İade Prosedürü
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Mega Oto Tuning. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-pink-400 text-sm">
                Gizlilik Politikası
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-pink-400 text-sm">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
