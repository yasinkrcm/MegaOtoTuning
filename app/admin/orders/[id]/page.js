import { getOrderById, getUserById } from '../../../../lib/data';
import Link from 'next/link';
import Image from 'next/image';
import OrderStatus from '../../../../components/OrderStatus';
import { OrderStatusUpdate } from '../../../../components/OrderStatusUpdate';
import PaymentStatusToggle from './PaymentStatusToggle';
import VerificationStatusToggle from './VerificationStatusToggle';

async function getSettings() {
  try {
    // Server-side'da absolute URL kullan
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/settings`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.warn('Settings API error:', res.status);
      return { bankName: '', accountHolder: '', iban: '' };
    }
    
    return await res.json();
  } catch (error) {
    console.error('Settings fetch error:', error);
    return { bankName: '', accountHolder: '', iban: '' };
  }
}

export default async function AdminOrderDetail({ params }) {
  const orderId = (await params).id;
  const order = await getOrderById(orderId);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600">Sipariş Bulunamadı</h1>
          <p className="mt-2 text-gray-600">Böyle bir sipariş kaydı bulunamadı.</p>
          <Link href="/admin/orders" className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-700">
            &larr; Siparişlere Geri Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Get user information
  const user = await getUserById(order.userId);
  const settings = await getSettings();
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-pink-100 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Sipariş Detayı</h1>
            <Link href="/admin/orders" className="text-pink-600 hover:text-pink-800">
              &larr; Siparişlere Geri Dön
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-pink-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Sipariş Bilgileri #{order._id.substring(0, 8)}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Oluşturulma Tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR')} {new Date(order.createdAt).toLocaleTimeString('tr-TR')}
              </p>
            </div>
            
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Müşteri</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-col">
                      <span><strong>İsim:</strong> {order.customerName || user?.name || 'Bilinmiyor'}</span>
                      <span><strong>E-posta:</strong> {user?.email || 'Bilinmiyor'}</span>
                      <span><strong>Telefon:</strong> {order.phoneNumber}</span>
                    </div>
                  </dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Sipariş Durumu</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-col gap-4">
                      <OrderStatus status={order.status} />
                      <OrderStatusUpdate orderId={order._id} initialStatus={order.status} />
                    </div>
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Teslimat Adresi</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.address}
                  </dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Toplam Tutar</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="text-lg font-semibold text-pink-600">{order.totalAmount.toFixed(2)} TL</span>
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ödeme Bilgileri</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-semibold text-blue-800 mb-2 pb-2 border-b border-blue-200">
                        Ödeme Yöntemi: {order.paymentMethod || 'Banka Transferi'}
                      </h4>
                      
                      {(!order.paymentMethod || order.paymentMethod === 'Banka Transferi') && (
                        <div className="mb-4">
                          <h5 className="font-medium text-blue-700 mb-2">Banka Transfer Bilgileri</h5>
                          <p><strong>Banka:</strong> {settings.bankName}</p>
                          <p><strong>Hesap Sahibi:</strong> {settings.accountHolder}</p>
                          <p><strong>IBAN:</strong> {settings.iban}</p>
                        </div>
                      )}


                      
                      <h4 className="font-semibold text-blue-800 mt-4 mb-2 pb-2 border-b border-blue-200">Müşteri Bilgileri</h4>
                      <p><strong>Adı Soyadı:</strong> {order.customerName || user?.name || "Belirtilmemiş"}</p>
                      <p><strong>E-posta:</strong> {user?.email || "Belirtilmemiş"}</p>
                      <p><strong>Telefon:</strong> {order.phoneNumber || "Belirtilmemiş"}</p>
                      <p><strong>Adres:</strong> {order.address || "Belirtilmemiş"}</p>
                    </div>
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ödeme Durumu</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <PaymentStatusToggle orderId={order._id} initialIsPaid={order.isPaid} />
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Kargo Bilgileri</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.cargoCompany && order.cargoTrackingNumber ? (
                      <div>
                        <p><strong>Kargo Şirketi:</strong> {order.cargoCompany}</p>
                        <p><strong>Takip Numarası:</strong> {order.cargoTrackingNumber}</p>
                      </div>
                    ) : (
                      <span>Kargo bilgisi yok</span>
                    )}
                  </dd>
                </div>
                
                {order.notes && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Sipariş Notu</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            <div className="px-4 py-5 sm:px-6 bg-pink-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sipariş Ürünleri</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Beden
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Birim Fiyat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <tr key={item.productId + '-' + (item.selectedSize || '-') + '-' + idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.size}</div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.price?.toFixed(2) || '—'} TL</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(item.price * item.quantity)?.toFixed(2) || '—'} TL</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
