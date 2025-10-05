import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Check if we're in production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, we can't write to filesystem
      // For now, return an error suggesting to use image URLs instead
      return NextResponse.json(
        { 
          error: 'Dosya yükleme şu anda kullanılamıyor. Lütfen resim URL\'si kullanın.',
          suggestion: 'Resim URL\'si giriniz (örn: https://example.com/image.jpg)'
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Resim dosyası bulunamadı' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Geçersiz dosya türü. Sadece resim dosyaları kabul edilir.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `product_${timestamp}.${extension}`;
    
    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);
    
    // Return the public URL
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Resim yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 