import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // For a simple logout, we'll just return success
    // The client will handle removing the user data from localStorage
    return NextResponse.json({ message: 'Çıkış başarılı' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
