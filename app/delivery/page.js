export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Teslimat Koşulları</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Genel Teslimat Bilgileri</h2>
              <p className="text-gray-700 mb-4">
                Mega Oto Tuning olarak, siparişlerinizi en hızlı ve güvenli şekilde teslim etmek için çalışıyoruz. 
                Teslimat süreleri ve koşulları aşağıda detaylandırılmıştır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teslimat Süreleri</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>İstanbul İçi:</strong> 1-2 iş günü</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Ankara, İzmir, Bursa:</strong> 2-3 iş günü</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Diğer Şehirler:</strong> 3-5 iş günü</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Uzak Bölgeler:</strong> 5-7 iş günü</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teslimat Ücretleri</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>150 TL ve üzeri alışverişlerde:</strong> Ücretsiz teslimat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>150 TL altı alışverişlerde:</strong> 25 TL teslimat ücreti</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Uzak bölgeler:</strong> Ek teslimat ücreti uygulanabilir</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teslimat Yöntemleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Kapıda Ödeme</h3>
                  <p className="text-gray-700 mb-3">
                    Siparişinizi kapıda nakit veya kredi kartı ile ödeyebilirsiniz.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ek ücret: 15 TL</li>
                    <li>• Maksimum tutar: 1000 TL</li>
                    <li>• Kimlik kontrolü zorunludur</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Online Ödeme</h3>
                  <p className="text-gray-700 mb-3">
                    Güvenli online ödeme ile siparişinizi tamamlayın.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Banka kartı ile ödeme</li>
                    <li>• Taksit seçenekleri mevcuttur</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teslimat Sırasında Dikkat Edilecekler</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span>Teslimat sırasında kimlik kontrolü yapılacaktır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span>Paketi teslim almadan önce dış paket kontrolü yapın</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span>Hasarlı paketleri teslim almayın ve tutanak tutun</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span>Teslimat sırasında evde olmadığınızda kargo firması ile iletişime geçin</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teslimat Takibi</h2>
              <p className="text-gray-700 mb-4">
                Siparişiniz kargoya verildikten sonra size SMS ve e-posta ile kargo takip numarası gönderilecektir. 
                Bu numara ile kargo firmasının web sitesinden siparişinizi takip edebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Özel Durumlar</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Hafta sonu teslimat:</strong> Ek ücret ile mümkündür</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Randevulu teslimat:</strong> Belirli saat aralığında teslimat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Adres değişikliği:</strong> Kargo firmasına bildirilmelidir</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
              <p className="text-gray-700 mb-4">
                Teslimat ile ilgili sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                                     <strong>Telefon:</strong> +90 506 892 2453<br />
                  <strong>E-posta:</strong> info@megaototuning.com<br />
                  <strong>Çalışma Saatleri:</strong> 7/24 destek
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
