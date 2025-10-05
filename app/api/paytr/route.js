import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Settings from '../../../lib/models/settings';
import Order from '../../../lib/models/order';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    // PayTR'nin aktif olup olmadığını kontrol et
    const settings = await Settings.findOne({});
    if (!settings?.paytrEnabled) {
      return NextResponse.json({ error: 'PayTR ödemeleri şu anda aktif değil' }, { status: 400 });
    }

    const { orderId, callbackUrl } = await request.json();

    // Siparişi bul
    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    // PayTR için gerekli parametreleri hazırla
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
    
    const email = order.userId.email;
    const payment_amount = Math.floor(order.totalAmount * 100); // Kuruş cinsinden
    const merchant_oid = order._id.toString();
    const user_name = order.customerName;
    const user_address = order.address;
    const user_phone = order.phoneNumber;
    const merchant_ok_url = `${callbackUrl}/success`;
    const merchant_fail_url = `${callbackUrl}/failed`;
    
    // Sepet içeriğini hazırla - PayTR formatına uygun olarak base64 encode edilmiş JSON
    const basketArray = order.items.map(item => [
      item.productName,
      (item.price * 100).toString(), // Kuruş cinsinden fiyat
      item.quantity.toString()
    ]);
    const user_basket = Buffer.from(JSON.stringify(basketArray)).toString('base64');

    // Token oluştur
    const token_string = `${merchant_id}${email}${merchant_oid}${payment_amount}${merchant_ok_url}${merchant_fail_url}${user_name}${user_address}${user_phone}${merchant_salt}`;
    const token = crypto.createHash('sha256').update(token_string).digest('base64');

    // PayTR için form verilerini hazırla
    const paytrData = {
      merchant_id,
      email,
      payment_amount,
      merchant_oid,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      user_basket,
      no_installment: 0,
      max_installment: 0,
      currency: 'TL',
      test_mode: 0, // Test modu devre dışı
      paytr_token: token,
    };

    return NextResponse.json(paytrData);
  } catch (error) {
    console.error('PayTR işlemi başlatılırken hata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PayTR'den gelen bildirimleri işle
export async function PUT(request) {
  try {
    const { merchant_oid, status } = await request.json();
    
    await connectToDatabase();
    const order = await Order.findById(merchant_oid);
    
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    if (status === 'success') {
      order.isPaid = true;
      order.status = 'hazırlanıyor';
    } else {
      order.isPaid = false;
      order.status = 'iptal edildi';
    }

    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
