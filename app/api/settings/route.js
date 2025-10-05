// Move this file to app/api/settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) {
    // Default values if not set
    settings = { bankName: '', accountHolder: '', iban: '' };
  }
  return NextResponse.json(JSON.parse(JSON.stringify(settings)));
}

export async function PUT(request) {
  await connectDB();
  const data = await request.json();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(data);
  } else {
    settings.bankName = data.bankName;
    settings.accountHolder = data.accountHolder;
    settings.iban = data.iban;
  }
  await settings.save();
  return NextResponse.json(JSON.parse(JSON.stringify(settings)));
} 