import { NextResponse } from 'next/server';

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

    console.log('PayTR Callback:', {
      merchant_oid: callback.merchant_oid,
      status: callback.status,
      total_amount: callback.total_amount,
      content_type: contentType
    });

    // PayTR’ye sadece düz metin "OK" dön
    return new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/plain" } });

  } catch (error) {
    console.error('PayTR callback error:', error);
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
