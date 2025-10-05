import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Form data olarak gelen veriyi işle
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    console.log('Test callback received:', body);
    
    // Basit bir yanıt döndür
    return NextResponse.json({ 
      status: 'OK',
      message: 'Test callback başarılı',
      receivedData: body
    });
  } catch (error) {
    console.error('Test callback error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  return NextResponse.json({ 
    status: 'OK',
    message: 'Test callback endpoint çalışıyor'
  });
}
