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
    settings = { 
      bankName: '', 
      accountHolder: '', 
      iban: '',
      paytrEnabled: false,
      ibanEnabled: true  // Default olarak aktif
    };
  }
  return NextResponse.json(JSON.parse(JSON.stringify(settings)));
}

export async function PUT(request) {
  await connectDB();
  const data = await request.json();
  let settings = await Settings.findOne();
  
  if (!settings) {
    // Yeni settings oluştur
    settings = new Settings(data);
  } else {
    // Mevcut settings'i güncelle
    if (data.bankName !== undefined) settings.bankName = data.bankName;
    if (data.accountHolder !== undefined) settings.accountHolder = data.accountHolder;
    if (data.iban !== undefined) settings.iban = data.iban;
    if (data.paytrEnabled !== undefined) settings.paytrEnabled = data.paytrEnabled;
    if (data.ibanEnabled !== undefined) settings.ibanEnabled = data.ibanEnabled;
  }
  
  await settings.save();
  return NextResponse.json(JSON.parse(JSON.stringify(settings)));
} 