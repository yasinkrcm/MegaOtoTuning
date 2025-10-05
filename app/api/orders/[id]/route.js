import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../lib/models/order';
import Log from '../../../../lib/models/log';
import { encryptSensitiveData, decryptSensitiveData, checkEncryptionSetup } from '../../../../lib/encryption';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Encryption setup kontrolü
    checkEncryptionSetup();
    
    params = await params;
    await connectDB();
    const data = await request.json();
    
    // Find the order first
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }
    

    
    // Eğer ödeme durumu değişiyorsa logla
    if (typeof data.isPaid === 'boolean' && data.isPaid !== order.isPaid) {
      const productNames = order.items.map(item => item.productName).join(', ');
      await Log.create({
        type: 'payment',
        message: `${order.customerName} (${order.userId}) ${productNames} ürününü sipariş etti ve ödemeyi ${data.isPaid ? 'yaptı' : 'yapmadı'}`,
        data: { orderId: order._id, isPaid: data.isPaid }
      });
    }
    

    
    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Sipariş güncellenemedi' }, { status: 404 });
    }
    
    // Ensure plain object for client
    return NextResponse.json(JSON.parse(JSON.stringify(updatedOrder)));
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
