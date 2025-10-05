import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../lib/models/order';
import { protectFromBannedUsers } from '../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Kullanıcı doğrulama
    const authCheck = await protectFromBannedUsers(request);
    if (!authCheck.allowed) {
      if (authCheck.reason === 'banned') {
        return NextResponse.json(
          { error: 'Bu hesap askıya alınmıştır. Destek ile iletişime geçin.' },
          { status: 403 }
        );
      } else {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }
    }

    await connectDB();

    // Eksik bedenleri güncelle
    const ordersToUpdate = await Order.find({ 'items.size': { $exists: false } });
    let updatedCount = 0;

    for (const order of ordersToUpdate) {
      let updated = false;

      order.items = order.items.map(item => {
        if (!item.size) {
          updated = true;
          return { ...item, size: item.selectedSize || '' };
        }
        return item;
      });

      if (updated) {
        await order.save();
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: 'Eksik beden bilgileri güncellendi.',
      updatedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET veya diğer methodlar desteklenmiyorsa 405 dön
export async function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}
