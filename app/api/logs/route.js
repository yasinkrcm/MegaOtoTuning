import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Log from '../../../lib/models/log';
import { protectFromBannedUsers } from '../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const logs = await Log.find().sort({ createdAt: -1 });
    return NextResponse.json(logs);
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
    
    await connectDB();
    const data = await request.json();
    
    // Create log entry
    const log = await Log.create(data);
    
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 