export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">İptal ve İade Prosedürü</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Genel İade Koşulları</h2>
              <p className="text-gray-700 mb-4">
                Mega Oto Tuning olarak, müşteri memnuniyetini en üst düzeyde tutmak için kapsamlı iade ve iptal politikaları sunuyoruz. 
                Aşağıda detaylı iade prosedürümüzü bulabilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cayma Hakkı</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>14 günlük cayma hakkı:</strong> Ürünü teslim aldığınız tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeksizin iade edebilirsiniz.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>Koşulsuz iade:</strong> Ürünün kullanılmamış ve orijinal ambalajında olması koşuluyla iade kabul edilir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>Ücretsiz iade:</strong> Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İade Edilebilir Ürünler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">İade Edilebilir</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kullanılmamış ürünler</li>
                    <li>• Orijinal ambalajında ürünler</li>
                    <li>• Eksik parçası olmayan ürünler</li>
                    <li>• Hasarsız ürünler</li>
                    <li>• Etiketi çıkarılmamış ürünler</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">İade Edilemez</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kullanılmış ürünler</li>
                    <li>• Ambalajı açılmış ürünler</li>
                    <li>• Hasarlı ürünler</li>
                    <li>• Eksik parçası olan ürünler</li>
                    <li>• Kişisel hijyen ürünleri</li>
                    <li>• Özel sipariş ürünleri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İade Prosedürü</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ol className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">1.</span>
                    <div>
                      <strong>İade Talebi:</strong> Müşteri hizmetlerimizle iletişime geçerek iade talebinizi bildirin.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">2.</span>
                    <div>
                      <strong>İade Formu:</strong> Size gönderilecek iade formunu doldurun ve ürünle birlikte gönderin.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">3.</span>
                    <div>
                      <strong>Paketleme:</strong> Ürünü orijinal ambalajında ve güvenli şekilde paketleyin.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">4.</span>
                    <div>
                      <strong>Kargo:</strong> Ürünü belirtilen adrese kargo ile gönderin.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">5.</span>
                    <div>
                      <strong>Kontrol:</strong> Ürün kontrol edildikten sonra iade işlemi tamamlanır.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">6.</span>
                    <div>
                      <strong>Ödeme İadesi:</strong> İade onaylandıktan sonra ödeme iadesi yapılır.
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İade Süreleri</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>İade talebi:</strong> 14 gün içinde yapılmalıdır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Kargo süresi:</strong> 3-5 iş günü</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Kontrol süresi:</strong> 1-2 iş günü</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">•</span>
                    <span><strong>Ödeme iadesi:</strong> 3-7 iş günü</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödeme İadesi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Kredi Kartı İadesi</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 3-7 iş günü içinde iade edilir</li>
                    <li>• Banka işlem süresine bağlıdır</li>
                    <li>• Kart ekstrenizde görünecektir</li>
                    <li>• Taksitli ödemelerde taksit iptal edilir</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Banka Hesabı İadesi</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 3-5 iş günü içinde iade edilir</li>
                    <li>• IBAN bilgileriniz gereklidir</li>
                    <li>• Banka havalesi ile yapılır</li>
                    <li>• Havale ücreti firmamıza aittir</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sipariş İptali</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span><strong>Kargo öncesi:</strong> Sipariş kargoya verilmeden önce ücretsiz iptal edilebilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span><strong>Kargo sonrası:</strong> Kargo verildikten sonra iade prosedürü uygulanır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span><strong>Özel siparişler:</strong> Üretime başlanmış özel siparişler iptal edilemez</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">⚠</span>
                    <span><strong>İptal talebi:</strong> Müşteri hizmetlerimizle iletişime geçerek yapılmalıdır</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Garanti Kapsamı</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>2 yıl garanti:</strong> Tüm ürünlerimiz 2 yıl garanti kapsamındadır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>Ücretsiz değişim:</strong> Garanti kapsamındaki ürünler ücretsiz değiştirilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>Teknik destek:</strong> Garanti süresince ücretsiz teknik destek</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span><strong>Parça değişimi:</strong> Arızalı parçalar orijinal parçalarla değiştirilir</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  İade ve iptal işlemleri için aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                                             <strong>Telefon:</strong> +90 506 892 2453<br />
                       <strong>WhatsApp:</strong> +90 506 892 2453<br />
                      <strong>E-posta:</strong> iade@megaototuning.com
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Çalışma Saatleri:</strong><br />
                      Pazartesi - Cumartesi: 09:00 - 18:00<br />
                      Pazar: 10:00 - 16:00<br />
                      <strong>Online destek:</strong> 7/24
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Önemli Notlar</h2>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">!</span>
                    <span>İade edilen ürünlerin kullanılmamış olması zorunludur</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">!</span>
                    <span>Orijinal ambalaj ve etiketler korunmalıdır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">!</span>
                    <span>İade formu eksiksiz doldurulmalıdır</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">!</span>
                    <span>Kargo ücreti müşteriye aittir (cayma hakkı kapsamında)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">!</span>
                    <span>Hasarlı ürünler iade kabul edilmez</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
