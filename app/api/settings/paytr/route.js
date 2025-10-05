import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Settings from '../../../../lib/models/settings';
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne({});
    return NextResponse.json({ paytrEnabled: settings?.paytrEnabled || false });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No Bearer token' }, { status: 401 });
    }

    // Admin kontrolü için AuthContext'ten gelen user bilgisini kullan
    const token = authorization.split(' ')[1];
    
    let userData;
    try {
      userData = JSON.parse(decodeURIComponent(token));
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token format', details: e.message }, { status: 401 });
    }
    
    if (!userData.role) {
      return NextResponse.json({ error: 'No role in user data', userData }, { status: 401 });
    }

    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Not admin role', role: userData.role }, { status: 401 });
    }

    const body = await request.json();

    if (typeof body.paytrEnabled !== 'boolean') {
      return NextResponse.json({ error: 'paytrEnabled must be boolean' }, { status: 400 });
    }

    await connectToDatabase();

    let settings = await Settings.findOne({});

    if (!settings) {
      settings = new Settings({
        bankName: 'Default Bank',
        accountHolder: 'Default Holder',
        iban: 'Default IBAN',
        paytrEnabled: false
      });
    }
    
    settings.paytrEnabled = body.paytrEnabled;
    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
