import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/user';
import bcrypt from 'bcryptjs';
import { protectFromBannedUsers } from '../../../lib/admin';
import Log from '../../../lib/models/log';

export const dynamic = 'force-dynamic';

export async function GET(request) {
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
    
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Kullanıcılar getirilemedi' }, { status: 500 });
  }
}

export async function PATCH(request) {
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
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const data = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    
    // Handle ban/unban action
    if (data.action === 'toggleBan') {
      user.isBanned = !user.isBanned;
      await user.save();
      
      return NextResponse.json({ 
        message: user.isBanned ? 'Kullanıcı başarıyla engellendi' : 'Kullanıcı engeli başarıyla kaldırıldı',
        isBanned: user.isBanned
      });
    }
    
    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Kullanıcı güncellenemedi' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    let reqBody;
    try {
      reqBody = await request.json();
    } catch (err) {
      console.error('[REGISTER] JSON parsing error:', err);
      return NextResponse.json({ error: 'Geçersiz istek formatı' }, { status: 400 });
    }
    
    const { name, email, password, kvkkConsent, kvkkConsentDate } = reqBody;
    
    // Validasyon
    if (!email || !password || !name) {
      console.log('[REGISTER] Missing required fields');
      return NextResponse.json({ error: 'Tüm alanları doldurunuz' }, { status: 400 });
    }
    
    // KVKK onayı kontrolü
    if (!kvkkConsent) {
      console.log('[REGISTER] KVKK consent not given');
      return NextResponse.json({ error: 'KVKK metnini onaylamanız gerekmektedir' }, { status: 400 });
    }
    
    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[REGISTER] Email already exists');
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılmakta' }, { status: 409 });
    }
    
    // Şifre güvenlik kontrolü
    if (password.length < 6) {
      console.log('[REGISTER] Password too short');
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 });
    }
    
    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      kvkkConsent: true,
      kvkkConsentDate: kvkkConsentDate || new Date()
    });
    
    // Log ekle
    await Log.create({
      type: 'user',
      message: `${user.name} (${user.email}) kayıt oldu`,
      data: { userId: user._id, email: user.email, name: user.name }
    });
    
    console.log('[REGISTER] User registered successfully');
    
    // Return the response without the password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      ...userResponse,
      message: 'Kayıt başarılı!'
    }, { status: 201 });
  } catch (error) {
    console.error("Kullanıcı kayıt hatası:", error);
    return NextResponse.json({ 
      error: 'Kullanıcı kaydı sırasında bir hata oluştu: ' + error.message 
    }, { status: 500 });
  }
}
