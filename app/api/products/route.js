import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/product';
import { protectFromBannedUsers } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const category = searchParams.get('category');
    const query = category ? { category } : {};

    const products = await Product.find({ ...query, inStock: true }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Check if user is authenticated and is admin
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
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin yetkisi gerekli' }, { status: 403 });
    }
    
    await connectDB();
    
    const data = await request.json();

    // ⏱ Zaman aşımı kontrolü (30 saniye)
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Ürün oluşturma süresi aşıldı')), 30000)
    );

    const productCreation = Product.create(data);
    const product = await Promise.race([productCreation, timeout]);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Ürün oluşturulurken hata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
