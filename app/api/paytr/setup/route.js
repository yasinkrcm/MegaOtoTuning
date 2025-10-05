import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // Environment'a göre bildirim URL'si belirle
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '  http://localhost:3000';
    const notification_url = `${baseUrl}/api/paytr/callback`;

    // Token oluştur
    const paytr_token = crypto.createHmac('sha256', merchant_key)
      .update(merchant_id + merchant_salt)
      .digest('base64');

    // PayTR API'sine gönderilecek form verisi
    const formData = {
      merchant_id,
      notification_url,
      paytr_token,
      debug_on: '1'
    };

    console.log('PayTR Setup isteği:', formData);

    // PayTR API'sine istek gönder
    const response = await fetch('https://www.paytr.com/odeme/api/merchant/notification-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString()
    });

    const paytrResponse = await response.json();
    console.log('PayTR Setup yanıtı:', paytrResponse);

    if (paytrResponse.status === 'success') {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Bildirim URL\'si başarıyla ayarlandı',
        notification_url: notification_url
      });
    } else {
      throw new Error(paytrResponse.reason || 'PayTR kurulum işlemi başarısız');
    }
  } catch (error) {
    console.error('PayTR kurulum hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
