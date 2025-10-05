import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { connectToDatabase } from '../../../../lib/mongodb';
import Order from '../../../../lib/models/order';

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
      paymentMethod: paymentMethod || 'PayTR',
      status: status || 'ödeme-bekliyor',
      paytrOrderId: null // PayTR'den gelecek
    });

    // Sipariş ID'sini merchant_oid olarak kullan
    const merchant_oid = order._id.toString();

    // Sepet içeriğini hazırla - PayTR formatına uygun olarak base64 encode edilmiş JSON
    const basketArray = items.map(item => [
      item.productName,
      (item.price * 100).toString(), // Kuruş cinsinden fiyat
      item.quantity.toString()
    ]);
    
    const user_basket = Buffer.from(JSON.stringify(basketArray)).toString('base64');

    // Kullanıcı IP'sini al
    const user_ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // Environment'a göre callback URL'leri belirle
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Ödeme için gerekli parametreler
    const payment_amount = Math.floor(totalAmount * 100).toString(); // 1.00 TL için 100 gönderilmeli
    const currency = "TL";
    const test_mode = "0";
    const merchant_ok_url = `${baseUrl}/checkout/success`;
    const merchant_fail_url = `${baseUrl}/checkout/failed`;
    const user_name = customerInfo.name;
    const user_phone = customerInfo.phone;
    const user_address = customerInfo.address;
    const email = customerInfo.email;
    const payment_type = "card";
    const debug_on = "1";
    const timeout_limit = "30";
    const no_installment = "0";
    const max_installment = "12";
    const lang = "tr";

    // Token string oluştur
    const token_string = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;

    // Token oluştur
    const paytr_token = crypto.createHmac('sha256', merchant_key)
      .update(token_string)
      .digest('base64');

    // PayTR API'sine gönderilecek form verisi
    const formData = {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      paytr_token,
      user_basket,
      debug_on,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit,
      currency,
      test_mode,
      lang,
      payment_type
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
      // Sipariş zaten oluşturuldu, sadece token'ı döndür
      return NextResponse.json({
        token: paytrResponse.token,
        orderId: order._id
      });
    } else {
      throw new Error(paytrResponse.reason || 'PayTR işlemi başarısız');
    }
  } catch (error) {
    console.error('PayTR işlemi hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}