'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { useAuth } from '../../components/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const { user, authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState({ paytrEnabled: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [paymentButtonClicked, setPaymentButtonClicked] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
    paymentMethod: 'Banka Transferi',
    isPaid: false,
    verificationCode: ''
  });

  useEffect(() => {
    // Ayarları kontrol et
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Ayarlar alınamadı:', err));
  }, []);

  useEffect(() => {
    // PayTR durumunu kontrol et
    fetch('/api/paytr-settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, paytrEnabled: data.paytrEnabled })))
      .catch(err => console.error('PayTR ayarları alınamadı:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Her input değiştiğinde hata mesajını temizle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const orderData = {
        userId: user?.id || '',
        customerName: formData?.name || '',
        items: Array.isArray(cart) ? cart.map(item => ({
          productId: item?.productId || '',
          productName: item?.productName || '',
          imageUrl: item?.imageUrl || '',
          price: item?.price || 0,
          quantity: item?.quantity || 1,
          size: item?.size || ''
        })) : [],
        totalAmount: totalPrice || 0,
        address: `${formData?.address || ''}, ${formData?.city || ''}, ${formData?.zipCode || ''}`,
        phoneNumber: formData?.phoneNumber || '',
        notes: formData?.notes || '',
        paymentMethod: formData.paymentMethod,
      };


      
      const response = await authenticatedFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      // Başarılı sayfasına yönlendir
      window.location.href = '/checkout/success';
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handlePaymentClick = async () => {
    try {
      // Form validasyonu
      if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
        setError('Lütfen geçerli bir telefon numarası giriniz');
        return;
      }

      if (!formData.address || formData.address.length < 10) {
        setError('Lütfen geçerli bir adres giriniz');
        return;
      }

      if (!formData.city || formData.city.length < 2) {
        setError('Lütfen geçerli bir şehir adı giriniz');
        return;
      }

      if (formData.paymentMethod === 'PayTR' || formData.paymentMethod === 'PayTR-EFT') {
        // PayTR ödeme işlemini başlat
        const paytrData = {
          items: cart.map(item => ({
            productId: item.productId,
            productName: item.productName,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
            size: item.size
          })),
          totalAmount: totalPrice,
          customerInfo: {
            userId: user._id || user.id,
            name: formData.name,
            phone: formData.phoneNumber,
            address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
            email: user.email
          },
          paymentMethod: formData.paymentMethod,
          status: 'ödeme-bekliyor'
        };

        // Endpoint seçimi: EFT mi yoksa Kredi Kartı mı?
        const endpoint = formData.paymentMethod === 'PayTR-EFT' 
          ? '/api/paytr/eft/create' 
          : '/api/paytr/create';

        const paytrResponse = await authenticatedFetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(paytrData)
        });

        if (!paytrResponse.ok) {
          const errorData = await paytrResponse.json();
          console.error('PayTR API hatası:', errorData);
          throw new Error(errorData.error || 'PayTR ödeme işlemi başlatılamadı');
        }

        const responseData = await paytrResponse.json();
        const { token } = responseData;
        
        // PayTR iframe'ini oluştur ve göster
        const iframeContainer = document.createElement('div');
        iframeContainer.style.position = 'fixed';
        iframeContainer.style.top = '0';
        iframeContainer.style.left = '0';
        iframeContainer.style.width = '100%';
        iframeContainer.style.height = '100%';
        iframeContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        iframeContainer.style.zIndex = '9999';
        iframeContainer.style.display = 'flex';
        iframeContainer.style.alignItems = 'center';
        iframeContainer.style.justifyContent = 'center';

        const iframe = document.createElement('iframe');
        // EFT ve Kredi Kartı için farklı URL'ler
        if (formData.paymentMethod === 'PayTR-EFT') {
          iframe.src = `https://www.paytr.com/odeme/api/${token}`;
        } else {
          iframe.src = `https://www.paytr.com/odeme/guvenli/${token}`;
        }
        iframe.style.width = '90%';
        iframe.style.height = '90%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.backgroundColor = 'white';

        iframeContainer.appendChild(iframe);
        document.body.appendChild(iframeContainer);

        // Kapatma işlevi
        iframeContainer.onclick = (e) => {
          if (e.target === iframeContainer) {
            document.body.removeChild(iframeContainer);
          }
        };

        return;
      }


    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError(`Ödeme işlemi sırasında hata oluştu: ${error.message}`);
      toast.error(`Ödeme işlemi başarısız: ${error.message}`);
    }
  };

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
          <p className="mt-2 text-gray-600">Siparişinizi tamamlayın</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sipariş özeti */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sipariş Özeti</h2>
              
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.productId + '-' + item.size} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.quantity} adet</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Ara Toplam</p>
                  <p>{totalPrice.toFixed(2)} TL</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Kargo</p>
                  <p>Ücretsiz</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-6">
                  <p>Toplam</p>
                  <p>{totalPrice.toFixed(2)} TL</p>
                </div>
              </div>
              
              {formData.paymentMethod === 'Banka Transferi' && (
                <div className="mt-6">
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Banka Hesap Bilgilerimiz</h3>
                    <div className="mt-2 text-xs text-gray-700">
                      <p>Banka: {settings.bankName || '—'}</p>
                      <p>Hesap Sahibi: {settings.accountHolder || '—'}</p>
                      <p>IBAN: {settings.iban || '—'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Ödeme formu */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow-sm rounded-md overflow-hidden">
                {/* Teslimat bilgileri */}
                <div className="bg-white p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Teslimat Bilgileri</h2>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-black">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-black">
                        Adres
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-black">
                        Şehir
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-black">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
                          setFormData(prev => ({ ...prev, zipCode: value }));
                        }}
                        required
                        placeholder="34000"
                        maxLength={5}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-black">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
                          setFormData(prev => ({ ...prev, phoneNumber: value }));
                        }}
                        required
                        placeholder="5068922453"
                        maxLength={11}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Ödeme yöntemi */}
                <div className="bg-white p-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Ödeme Yöntemleri</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="bank-transfer"
                        name="paymentMethod"
                        type="radio"
                        value="Banka Transferi"
                        checked={formData.paymentMethod === 'Banka Transferi'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                      />
                      <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                        Banka Transferi (Manuel)
                      </label>
                    </div>

                    {settings.paytrEnabled && (
                      <>
                        <div className="flex items-center">
                          <input
                            id="paytr"
                            name="paymentMethod"
                            type="radio"
                            value="PayTR"
                            checked={formData.paymentMethod === 'PayTR'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                          />
                          <label htmlFor="paytr" className="ml-3 flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Kredi Kartı ile Ödeme</span>
                            <img src="https://www.paytr.com/wp-content/uploads/logo-1.png" alt="PayTR" className="h-2" />
                            <span className="text-xs text-green-600">(3D Secure)</span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="paytr-eft"
                            name="paymentMethod"
                            type="radio"
                            value="PayTR-EFT"
                            checked={formData.paymentMethod === 'PayTR-EFT'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                          />
                          <label htmlFor="paytr-eft" className="ml-3 flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Havale/EFT Bildirimi</span>
                            <img src="https://www.paytr.com/wp-content/uploads/logo-1.png" alt="PayTR" className="h-2" />
                            <span className="text-xs text-blue-600">(Otomatik Onay)</span>
                          </label>
                        </div>
                      </>
                    )}
                    
                    {formData.paymentMethod === 'Banka Transferi' && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm">
                        <p className="font-medium text-blue-800 mb-2">Banka Hesap Bilgileri:</p>
                        <p className="mb-1 text-black"><strong>Banka:</strong> {settings.bankName || '—'}</p>
                        <p className="mb-1 text-black"><strong>Hesap Sahibi:</strong> {settings.accountHolder || '—'}</p>
                        <p className="mb-1 text-black"><strong>IBAN:</strong> {settings.iban || '—'}</p>
                      </div>
                    )}


                  </div>
                </div>
                
                {/* Sipariş notları */}
                <div className="bg-white p-6 border-t border-black">
                  <h2 className="text-lg font-medium text-black mb-6">Sipariş Notu</h2>
                  
                  <div>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black"
                      placeholder="Siparişinizle ilgili eklemek istediğiniz notlar..."
                    />
                  </div>
                </div>
                
                {/* Form gönder */}
                <div className="bg-white p-6 border-t border-gray-200">
                  {(formData.paymentMethod === 'PayTR' || formData.paymentMethod === 'PayTR-EFT') ? (
                    <button
                      type="button"
                      onClick={handlePaymentClick}
                      className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        formData.paymentMethod === 'PayTR-EFT'
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {formData.paymentMethod === 'PayTR-EFT' 
                        ? 'Havale/EFT Bildirimini Başlat' 
                        : 'Kredi Kartı ile Ödeme Yap'}
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center mb-4">
                        <input
                          id="isPaid"
                          name="isPaid"
                          type="checkbox"
                          checked={formData.isPaid}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                          Ödeme yaptım.
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 ${
                          loading
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                        }`}
                      >
                        {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}