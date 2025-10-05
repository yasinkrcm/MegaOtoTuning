import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/product';
import { protectFromBannedUsers } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
