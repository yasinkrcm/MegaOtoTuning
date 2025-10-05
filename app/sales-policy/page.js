export default function SalesPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Satış Politikası</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Genel Satış Koşulları</h2>
              <p className="text-gray-700 mb-4">
                Mega Oto Tuning olarak, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmaya çalışıyoruz. 
                Satış politikamız şeffaflık ve müşteri memnuniyeti üzerine kurulmuştur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fiyatlandırma Politikası</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>Tüm fiyatlarımız KDV dahildir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>Fiyatlar stok durumuna göre değişiklik gösterebilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>Kampanya fiyatları sınırlı süre için geçerlidir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>Fiyat değişikliklerinde önceden bilgilendirme yapılır</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödeme Seçenekleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Online Ödeme</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Banka kartı ile ödeme</li>
                    <li>• Taksit seçenekleri (3, 6, 9, 12 ay)</li>
                    <li>• Güvenli SSL sertifikası</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Kapıda Ödeme</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Nakit ödeme</li>
                    <li>• Ek ücret: 15 TL</li>
                    <li>• Maksimum tutar: 1000 TL</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stok Durumu</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Stokta olan ürünler aynı gün kargoya verilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Stokta olmayan ürünler için tedarik süresi belirtilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Stok durumu gerçek zamanlı güncellenir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>Beklenmeyen stok sorunlarında müşteri bilgilendirilir</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sipariş İşleme</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">1.</span>
                    <span>Sipariş onayı e-posta ile gönderilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">2.</span>
                    <span>Ödeme kontrolü yapılır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">3.</span>
                    <span>Ürün hazırlanır ve paketlenir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">4.</span>
                    <span>Kargo firmasına teslim edilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">5.</span>
                    <span>Kargo takip bilgisi gönderilir</span>
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kalite Garantisi</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Tüm ürünlerimiz orijinal ve garantilidir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Üretim hatalarına karşı 2 yıl garanti</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Kalite kontrolü her ürün için yapılır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>Garanti kapsamında ücretsiz değişim</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Müşteri Hizmetleri</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>7/24 müşteri desteği</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>Ücretsiz teknik destek</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>WhatsApp destek hattı</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span>E-posta ile destek</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gizlilik ve Güvenlik</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">🔒</span>
                    <span>Kişisel bilgileriniz güvenle korunur</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">🔒</span>
                    <span>SSL sertifikası ile güvenli ödeme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">🔒</span>
                    <span>KVKK uyumlu veri işleme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">🔒</span>
                    <span>Kredi kartı bilgileri saklanmaz</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
              <p className="text-gray-700 mb-4">
                Satış politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                                     <strong>Telefon:</strong> +90 506 892 2453<br />
                   <strong>E-posta:</strong> info@megaototuning.com<br />
                   <strong>WhatsApp:</strong> +90 506 892 2453<br />
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
