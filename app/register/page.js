'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import KVKKText from '../../components/KVKKText';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [showKVKK, setShowKVKK] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);
    
    // Validation
    if (!email || !password || !name) {
      setMessage('Lütfen tüm alanları doldurun.');
      setIsLoading(false);
      return;
    }
    
    if (!kvkkConsent) {
      setMessage('KVKK metnini onaylamanız gerekmektedir.');
      setIsLoading(false);
      return;
    }
    
    if (!termsConsent) {
      setMessage('Mesafeli Satış Sözleşmesi ve İptal/İade Prosedürü metinlerini onaylamanız gerekmektedir.');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setMessage('Şifre en az 6 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }
    
    if (password !== passwordConfirm) {
      setMessage('Şifreler eşleşmiyor.');
      setIsLoading(false);
      return;
    }
    
    try {
  
      
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          kvkkConsent: true,
          kvkkConsentDate: new Date()
        })
      });
      
      // Yanıt gövdesini alın
      let data = {};
      let responseText = '';
      
      try {
        // Önce ham yanıt metnini alalım
        responseText = await res.text();
        
        // Boş yanıt kontrolü
        if (!responseText || responseText.trim() === '') {
          console.warn('Empty response received from server');
          data = { error: 'Sunucudan boş yanıt alındı.' };
        } else {
          // Sonra JSON olarak ayrıştırmayı deneyelim
          try {
            data = JSON.parse(responseText);
          } catch (jsonError) {
            console.error('JSON parse error for text:', responseText);
            console.error('Parse error details:', jsonError);
            data = { error: 'Sunucu yanıtı geçerli JSON formatında değil.' };
          }
        }
      } catch (err) {
        console.error('Error reading response:', err);
        data = { error: 'Sunucu yanıtı işlenirken hata oluştu.' };
      }
      
      
      
      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message || 'Kayıt başarılı! Giriş yapabilirsiniz.');
        
        // Automatically log in the user after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        
        setEmail(''); 
        setPassword(''); 
        setPasswordConfirm('');
        setName('');
        setKvkkConsent(false); // Reset consent on successful registration
      } else {
        console.error('Registration failed:', data);
        setMessage(data?.error || `Kayıt başarısız. (Hata kodu: ${res.status})`);
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setMessage('Bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-700 text-center">Kayıt Ol</h1>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            {isSuccess ? (
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {message}
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      2 saniye içinde giriş sayfasına yönlendirileceksiniz.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-1">Ad Soyad</label>
                  <input 
                    id="name"
                    type="text" 
                    placeholder="Ad Soyad" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-1">E-posta</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="E-posta adresiniz" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-black mb-1">Şifre</label>
                  <div className="relative">
                    <input 
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="Şifre (en az 6 karakter)" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black" 
                      required 
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-black mb-1">Şifre Tekrar</label>
                  <input 
                    id="passwordConfirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifreyi tekrar girin" 
                    value={passwordConfirm} 
                    onChange={e => setPasswordConfirm(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black" 
                    required 
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="kvkkConsent" 
                    checked={kvkkConsent} 
                    onChange={e => setKvkkConsent(e.target.checked)} 
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                    required 
                  />
                  <label htmlFor="kvkkConsent" className="ml-2 text-sm text-black">
                    <button
                      type="button"
                      onClick={() => setShowKVKK(true)}
                      className="text-red-600 hover:text-red-500 underline"
                    >
                      KVKK metnini
                    </button>
                    {' '}okudum ve onaylıyorum.
                  </label>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="termsConsent" 
                    checked={termsConsent} 
                    onChange={e => setTermsConsent(e.target.checked)} 
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                    required 
                  />
                  <label htmlFor="termsConsent" className="ml-2 text-sm text-black">
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-red-600 hover:text-red-500 underline"
                    >
                      Mesafeli Satış Sözleşmesi
                    </button>
                    {' '}ve{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-red-600 hover:text-red-500 underline"
                    >
                      İptal ve İade Prosedürü
                    </button>
                    {' '}metinlerini okudum ve onaylıyorum.
                  </label>
                </div>

                {/* KVKK Modal */}
                {showKVKK && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-black">KVKK Aydınlatma Metni</h2>
                        <button
                          onClick={() => setShowKVKK(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <KVKKText />
                      </div>
                      <div className="p-4 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => {
                            setKvkkConsent(true);
                            setShowKVKK(false);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                        >
                          Onaylıyorum
                        </button>
                        <button
                          onClick={() => setShowKVKK(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Kapat
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms Modal */}
                {showTerms && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-black">Mesafeli Satış Sözleşmesi ve İptal/İade Prosedürü</h2>
                        <button
                          onClick={() => setShowTerms(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-64">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-black mb-3">Mesafeli Satış Sözleşmesi</h3>
                          <div className="text-sm text-gray-700 space-y-2">
                            <p><strong>1. TARAFLAR</strong></p>
                            <p><strong>SATICI:</strong> Mega Oto Tuning</p>
                            <p><strong>ALICI:</strong> Sipariş formunda belirtilen kişi</p>
                            <p><strong>2. KONU</strong></p>
                            <p>İşbu Mesafeli Satış Sözleşmesi, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini verdiği ürünün satışı ve teslimi ile ilgili olarak tarafların hak ve yükümlülüklerini düzenler.</p>
                            <p><strong>3. CAYMA HAKKI</strong></p>
                            <p>ALICI, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, malı teslim aldığı veya sözleşmenin imzalandığı tarihten itibaren 14 (on dört) gün içerisinde malı iade etmek suretiyle sözleşmeden cayma hakkına sahiptir.</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black mb-3">İptal ve İade Prosedürü</h3>
                          <div className="text-sm text-gray-700 space-y-2">
                            <p><strong>14 günlük cayma hakkı:</strong> Ürünü teslim aldığınız tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeksizin iade edebilirsiniz.</p>
                            <p><strong>Koşulsuz iade:</strong> Ürünün kullanılmamış ve orijinal ambalajında olması koşuluyla iade kabul edilir.</p>
                            <p><strong>İade prosedürü:</strong> Müşteri hizmetlerimizle iletişime geçerek iade talebinizi bildirin.</p>
                            <p><strong>Ödeme iadesi:</strong> İade onaylandıktan sonra 3-7 iş günü içinde ödeme iadesi yapılır.</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => {
                            setTermsConsent(true);
                            setShowTerms(false);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                        >
                          Onaylıyorum
                        </button>
                        <button
                          onClick={() => setShowTerms(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Kapat
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </span>
                  ) : 'Kayıt Ol'}
                </button>
                
                {message && !isSuccess && (
                  <div className="p-3 rounded-md text-center text-sm bg-red-50 text-red-700 mt-4">
                    {message}
                  </div>
                )}
              </form>
            )}
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link href="/login" className="text-red-600 hover:text-red-500 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
    </main>
  );
}
