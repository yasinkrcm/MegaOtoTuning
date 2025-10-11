import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '../../../../../lib/mongodb';
import Order from '../../../../../lib/models/order';

/**
 * PayTR EFT Ara Bildirim Endpoint'i
 * Müşteri bildirim formunu doldurduğunda PayTR bu endpoint'e bilgi gönderir
 */
export async function POST(request) {
  try {
    let callback = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      callback = Object.fromEntries(formData);
    } else {
      try {
        callback = await request.json();
      } catch {
        const text = await request.text();
        const params = new URLSearchParams(text);
        callback = Object.fromEntries(params);
      }
    }

    // PayTR ayarlarını al
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_key || !merchant_salt) {
      console.error('PayTR ayarları eksik');
      return new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
    }

    // Hash doğrulaması yap
    // Ara bildirim için hash: merchant_oid + bank + merchant_salt
    const hashString = callback.merchant_oid + callback.bank + merchant_salt;
    const calculatedHash = crypto.createHmac('sha256', merchant_key)
      .update(hashString)
      .digest('base64');

    if (calculatedHash !== callback.hash) {
      console.error('PayTR ara bildirim hash doğrulaması başarısız!');
      return new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
    }

    // Veritabanına bağlan ve siparişi güncelle
    await connectToDatabase();
    
    const order = await Order.findById(callback.merchant_oid);

    if (order) {
      // Ara bildirim bilgilerini sipariş notuna ekle
      const infoNote = `
EFT/Havale Bildirim Bilgileri:
- Banka: ${callback.bank || '-'}
- Gönderen: ${callback.user_name || '-'}
- Telefon: ${callback.user_phone || '-'}
- Gönderim Tarihi: ${callback.payment_sent_date || '-'}
- TC Son 5 Hane: ${callback.tc_no_last5 || '-'}
      `.trim();

      order.notes = order.notes ? `${order.notes}\n\n${infoNote}` : infoNote;
      order.status = 'ödeme-bildirimi-yapıldı'; // Özel durum: bildirim yapıldı, onay bekleniyor
      await order.save();
    }

    // PayTR'ye sadece düz metin "OK" dön
    return new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/plain" } });

  } catch (error) {
    console.error('PayTR ara bildirim error:', error);
    // Hata durumunda bile OK döndür
    return new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
  }
}

// GET ve diğer methodlar için 405 Method Not Allowed
export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 });
}
export async function PUT() {
  return new NextResponse("Method not allowed", { status: 405 });
}
export async function DELETE() {
  return new NextResponse("Method not allowed", { status: 405 });
}

