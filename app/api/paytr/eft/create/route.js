import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { connectToDatabase } from '../../../../../lib/mongodb';
import Order from '../../../../../lib/models/order';

export async function POST(request) {
  try {
    // Yetkilendirme kontrolü
    const headersList = headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();
    const { items, totalAmount, customerInfo, paymentMethod, status } = requestData;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items data' }, { status: 400 });
    }
    if (!customerInfo) {
      return NextResponse.json({ error: 'Customer info is missing' }, { status: 400 });
    }
    if (!customerInfo.userId) {
      return NextResponse.json({ error: 'Customer userId is missing' }, { status: 400 });
    }

    // PayTR için gerekli parametreleri hazırla
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // Environment variables kontrolü
    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('PayTR environment variables eksik:', {
        merchant_id: !!merchant_id,
        merchant_key: !!merchant_key,
        merchant_salt: !!merchant_salt
      });
      return NextResponse.json({ 
        error: 'PayTR ayarları yapılandırılmamış. Lütfen sistem yöneticisi ile iletişime geçin.' 
      }, { status: 500 });
    }

    // Önce siparişi oluştur
    await connectToDatabase();
    const order = await Order.create({
      userId: customerInfo.userId,
      customerName: customerInfo.name,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      })),
      totalAmount,
      address: customerInfo.address,
      phoneNumber: customerInfo.phone,
      paymentMethod: 'PayTR-EFT',
      status: 'ödeme-bekliyor',
      paytrOrderId: null
    });

    // Sipariş ID'sini merchant_oid olarak kullan
    const merchant_oid = order._id.toString();

    // Kullanıcı IP'sini al
    const user_ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // EFT ödeme için gerekli parametreler
    const payment_amount = Math.floor(totalAmount * 100); // Kuruş cinsinden
    const email = customerInfo.email;
    const payment_type = 'eft';
    const test_mode = '0'; // Canlı mod için 0, test için 1
    const timeout_limit = '30'; // Dakika cinsinden
    const debug_on = '0'; // Canlı ortam için 0
    const user_name = customerInfo.name;
    const user_phone = customerInfo.phone;

    // Hash string oluştur: merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + test_mode
    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${test_mode}`;
    const paytr_token_string = hashSTR + merchant_salt;
    
    // Token oluştur: HMAC-SHA256 with merchant_key
    const paytr_token = crypto.createHmac('sha256', merchant_key)
      .update(paytr_token_string)
      .digest('base64');

    // PayTR API'sine gönderilecek form verisi
    const formData = {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount.toString(),
      payment_type,
      paytr_token,
      user_name,
      user_phone,
      debug_on,
      timeout_limit,
      test_mode
    };

    // PayTR API'sine istek gönder
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString()
    });

    const paytrResponse = await response.json();

    if (paytrResponse.status === 'success') {
      return NextResponse.json({
        token: paytrResponse.token,
        orderId: order._id
      });
    } else {
      // Hata durumunda siparişi sil
      await Order.findByIdAndDelete(order._id);
      throw new Error(paytrResponse.reason || 'PayTR EFT işlemi başarısız');
    }
  } catch (error) {
    console.error('PayTR EFT işlemi hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

