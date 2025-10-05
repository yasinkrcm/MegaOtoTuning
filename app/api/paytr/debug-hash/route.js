import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  console.log('Debug hash endpoint called');
  
  try {
    console.log('Processing form data...');
    const formData = await request.formData();
    const callback = Object.fromEntries(formData);
    
    console.log('Received callback data:', callback);
    
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    console.log('Using merchant credentials:', { merchant_key, merchant_salt });

    // Hash doğrulama
    const token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
    const paytr_token = crypto.createHmac('sha256', merchant_key)
      .update(token)
      .digest('base64');

    console.log('Hash calculated successfully');

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      received_data: callback,
      hash_verification: {
        received_hash: callback.hash,
        calculated_hash: paytr_token,
        token_string: token,
        is_valid: paytr_token === callback.hash
      },
      environment: {
        merchant_key: merchant_key,
        merchant_salt: merchant_salt,
        node_env: process.env.NODE_ENV
      }
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Hash debug error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: 'Debug hash endpoint is working',
    timestamp: new Date().toISOString(),
    methods: ['POST'],
    description: 'Send form data with merchant_oid, status, total_amount, hash fields'
  });
}
