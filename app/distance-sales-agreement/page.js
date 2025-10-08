export default function DistanceSalesAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mesafeli Satış Sözleşmesi</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. TARAFLAR</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>SATICI:</strong><br />
                  <strong>Ünvan:</strong> Mega Oto Tuning<br />
                  <strong>Adres:</strong> Keban Merkez Sanayi Sitesi, A Blok No: 10, Elazığ, Türkiye<br />
                  <strong>Telefon:</strong> +90 512 345 6789<br />
                  <strong>E-posta:</strong> info@megaototuning.com<br />
                  <strong>Web Sitesi:</strong> www.megaototuning.com
                </p>
                <p className="text-gray-700">
                  <strong>ALICI:</strong><br />
                  Sipariş formunda belirtilen kişi
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. KONU</h2>
              <p className="text-gray-700 mb-4">
                İşbu Mesafeli Satış Sözleşmesi, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini verdiği 
                aşağıda nitelikleri ve satış bedeli belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin 
                Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. GENEL HÜKÜMLER</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">3.1.</span>
                    <span>ALICI, sitedeki ürün tanıtım sayfasında yer alan ürünün temel nitelikleri, satış bedeli ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu kabul eder.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">3.2.</span>
                    <span>ALICI, sipariş verdiği ürünün satış bedelini, herhangi bir ek maliyet olup olmadığını, teslimat bilgilerini ve cayma hakkına ilişkin bilgileri önceden öğrenme hakkına sahiptir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">3.3.</span>
                    <span>ALICI, sipariş verdiği ürünün tüm özelliklerini ve fiyatını kabul ettiğini beyan eder.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. SÖZLEŞME KONUSU ÜRÜN</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>Ürünün:</strong><br />
                  • Cinsi ve türü: Sipariş formunda belirtilen ürün<br />
                  • Miktarı: Sipariş formunda belirtilen adet<br />
                  • Marka/modeli: Ürün sayfasında belirtilen marka ve model<br />
                  • Satış bedeli: Sipariş formunda belirtilen tutar (KDV dahil)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. GENEL ÖDEME ŞARTLARI</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">5.1.</span>
                    <span>Ürün satış bedeli sipariş anında ALICI tarafından SATICI'ya ödenir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">5.2.</span>
                    <span>Ödeme, kredi kartı, banka kartı veya kapıda ödeme yöntemlerinden biri ile yapılabilir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">5.3.</span>
                    <span>Kapıda ödeme seçeneğinde ek ücret alınır.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">5.4.</span>
                    <span>Kredi kartı ile taksitli ödeme seçenekleri mevcuttur.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. TESLİMAT</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">6.1.</span>
                    <span>SATICI, sözleşme konusu ürünü ALICI'nın sipariş formunda belirttiği adrese teslim etmekle yükümlüdür.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">6.2.</span>
                    <span>ALICI, ürünü teslim almadan önce dış paket kontrolü yapmakla yükümlüdür.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">6.3.</span>
                    <span>Hasarlı paketlerin teslim alınmaması ve tutanak tutulması gerekir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">6.4.</span>
                    <span>Teslimat süreleri sipariş anında belirtilir ve müşteri bilgilendirilir.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. CAYMA HAKKI</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">7.1.</span>
                    <span>ALICI, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, malı teslim aldığı veya sözleşmenin imzalandığı tarihten itibaren 14 (on dört) gün içerisinde malı iade etmek suretiyle sözleşmeden cayma hakkına sahiptir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">7.2.</span>
                    <span>Cayma hakkının kullanılması halinde, 3. kişilere veya ALICI'ya ait kargo şirketine malın teslim edilmesinden itibaren 14 gün içerisinde SATICI'ya iade edilmesi gerekir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">7.3.</span>
                    <span>Cayma hakkının kullanılması halinde, kargo ücreti ALICI'ya aittir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">7.4.</span>
                    <span>İade edilen ürünün kullanılmamış ve orijinal ambalajında olması gerekir.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. UYUŞMAZLIK ÇÖZÜMÜ</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">8.1.</span>
                    <span>İşbu sözleşmeden doğan uyuşmazlıklarda, Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">8.2.</span>
                    <span>ALICI, uyuşmazlık durumunda Tüketici Hakem Heyetlerine başvurabilir.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2">8.3.</span>
                    <span>6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri saklıdır.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. YÜRÜRLÜK</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>9 (dokuz) maddeden oluşan işbu Mesafeli Satış Sözleşmesi, taraflarca okunmuş, anlaşılmış ve kabul edilmiş olup, 
                  elektronik ortamda sipariş verilmesi ile yürürlüğe girmiştir.</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
              <p className="text-gray-700 mb-4">
                Mesafeli satış sözleşmesi hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>Telefon:</strong> +90 506 892 2453<br />
                  <strong>E-posta:</strong> info@megaototuning.com<br />
                  <strong>Adres:</strong> Örnek Mahallesi, Tuning Caddesi No:123, 34000 İstanbul<br />
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
