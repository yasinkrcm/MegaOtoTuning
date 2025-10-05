'use server';

import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from './models/user';

// This function must be called from a server component/action
export async function signInWithCredentials(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email ve şifre gerekli');
  }

  try {
    await connectDB();
    
    // Find user in MongoDB
    const user = await User.findOne({ email: credentials.email.toLowerCase() });
    
    if (!user) {
  
      throw new Error('Kullanıcı bulunamadı');
    }
    
    if (user.isBanned) {

      throw new Error('Bu hesap askıya alınmıştır. Destek ile iletişime geçin.');
    }
    
    if ((!user.emailVerified || user.isVerified === 0) && user.role !== 'admin') {

      throw new Error('E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin veya yeni doğrulama e-postası isteyin.');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isPasswordValid) {
  
      throw new Error('Geçersiz şifre');
    }


    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('[AUTH] Authentication error:', error.message);
    throw new Error(error.message || 'Giriş yapılırken hata oluştu');
  }
}
