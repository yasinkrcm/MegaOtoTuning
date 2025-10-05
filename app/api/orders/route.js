import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../lib/models/order';
import { protectFromBannedUsers } from '../../../lib/admin';
import Log from '../../../lib/models/log';
import { encryptSensitiveData, maskCardNumber, decryptSensitiveData, checkEncryptionSetup } from '../../../lib/encryption';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Check if user is authenticated and not banned
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
    
    const session = authCheck.session;
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Regular users can only see their own orders
    // Admins can see all orders or filter by userId
    let query = {};
    
    if (session.user.role === 'admin') {
      if (userId) {
        query.userId = userId;
      }
    } else {
      query.userId = session.user.id;
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    // Admin kullanıcılar için tüm siparişleri döndür
    if (session.user.role === 'admin') {
      return NextResponse.json(orders);
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Check if user is authenticated and not banned
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
    
    const session = authCheck.session;
    
    await connectDB();
    const data = await request.json();
    
    // Ensure the order is created for the logged-in user
    data.userId = session.user.id;
    
    // Set initial status to 'iletildi'
    data.status = 'iletildi';
    
    // Set payment method based on the data received
    data.paymentMethod = data.paymentMethod || 'Banka Transferi';
    data.isPaid = typeof data.isPaid === 'boolean' ? data.isPaid : false;



    // Create order in MongoDB
    const order = await Order.create(data);
    
    // Log ekle
    const productNames = order.items.map(item => item.productName).join(', ');
    const logMessage = `${order.customerName} (${order.userId}) ${productNames} ürününü sipariş etti ve ${order.paymentMethod} ile ödemeyi ${order.isPaid ? 'yaptı' : 'yapmadı'}`;
    
    await Log.create({
      type: 'order',
      message: logMessage,
      data: order
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Check if user is authenticated and not banned
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
    
    const session = authCheck.session;
    
    // Only admins can delete orders
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }
    
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Sipariş ID gerekli' }, { status: 400 });
    }
    
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sipariş başarıyla silindi',
      deletedOrder 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
