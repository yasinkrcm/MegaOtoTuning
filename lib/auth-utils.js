// auth-utils.js - Auth utilities for email verification
import connectDB from './mongodb';
import User from './models/user';
import crypto from 'crypto';
import { sendVerificationEmail } from './emailService';

// Function to generate a verification token
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Function to send verification email to a user
export async function sendUserVerificationEmail(email) {
  try {
    await connectDB();
    
    // Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`[AUTH-UTILS] User not found for email: ${email}`);
      return { success: false, message: 'Kullanıcı bulunamadı' };
    }
    
    // Check if already verified
    if (user.emailVerified === true && user.isVerified === 1) {
      console.log(`[AUTH-UTILS] User already verified: ${email}`);
      return { success: false, message: 'E-posta zaten doğrulanmış' };
    }
    
    // Generate token
    const token = generateVerificationToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 saat geçerli
    
    // Update user with token
    user.verificationToken = token;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save();
    console.log(`[AUTH-UTILS] Generated verification token for ${email}: ${token.substring(0, 10)}...`);
    
    // Generate verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
    
    // Send email
    const emailResult = await sendVerificationEmail(user, verificationUrl);
    
    if (emailResult.success) {
      console.log(`[AUTH-UTILS] Verification email sent successfully to ${email}`);
      return { 
        success: true, 
        message: 'Doğrulama e-postası başarıyla gönderildi. Lütfen gelen kutunuzu kontrol edin.' 
      };
    } else {
      console.error(`[AUTH-UTILS] Failed to send verification email to ${email}:`, emailResult.error);
      return { 
        success: false, 
        message: 'Doğrulama e-postası gönderilirken bir hata oluştu',
        error: emailResult.error
      };
    }
    
  } catch (error) {
    console.error('[AUTH-UTILS] Error sending verification email:', error);
    return { 
      success: false, 
      message: `Bir hata oluştu: ${error.message}` 
    };
  }
}

// Function to verify a user by token
export async function verifyUserByToken(token) {
  try {
    await connectDB();
    
    // Find user by token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() } // Token not expired
    });
    
    if (!user) {
      console.log(`[AUTH-UTILS] Invalid or expired token: ${token.substring(0, 10)}...`);
      return { 
        success: false, 
        message: 'Geçersiz veya süresi dolmuş doğrulama kodu' 
      };
    }
    
    console.log(`[AUTH-UTILS] Valid token found for user: ${user.email}`);
    
    // Update user verification status
    user.emailVerified = true;
    user.isVerified = 1;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
    
    console.log(`[AUTH-UTILS] User verified successfully: ${user.email}`);
    
    return { 
      success: true, 
      message: 'E-posta doğrulama başarılı',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    console.error('[AUTH-UTILS] Error during token verification:', error);
    return { 
      success: false, 
      message: `Doğrulama sırasında bir hata oluştu: ${error.message}` 
    };
  }
}

// Function to check if a user is verified
export async function checkUserVerification(email) {
  try {
    await connectDB();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı',
        isVerified: false
      };
    }
    
    const isVerified = user.emailVerified === true && user.isVerified === 1;
    
    return {
      success: true,
      message: isVerified ? 'Kullanıcı e-postası doğrulanmış' : 'Kullanıcı e-postası doğrulanmamış',
      isVerified,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    console.error('[AUTH-UTILS] Error checking user verification:', error);
    return {
      success: false,
      message: `Kullanıcı doğrulama kontrolünde hata: ${error.message}`,
      isVerified: false
    };
  }
}
