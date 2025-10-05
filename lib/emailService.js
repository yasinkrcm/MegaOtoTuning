import nodemailer from 'nodemailer';
import crypto from 'crypto';

// SMTP konfigürasyonu için log


// Gmail için özel yapılandırma
const transportOptions = {
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // Gmail için ek güvenlik ayarları
  tls: {
    rejectUnauthorized: false
  }
};

// Nodemailer transporter oluşturma
const transporter = nodemailer.createTransport(transportOptions);

// Doğrulama token'ı oluşturma
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Doğrulama e-postası gönderme
export async function sendVerificationEmail(user, verificationUrl) {

  
  const mailOptions = {
    from: `"Mega Oto Tuning" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: user.email,
    subject: 'Mega Oto Tuning - E-posta Adresinizi Doğrulayın',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #e53935;">Mega Oto Tuning</h1>
        </div>
        <p style="margin-bottom: 20px; font-size: 16px;">Merhaba ${user.name},</p>
        <p style="margin-bottom: 20px; font-size: 16px;">Hesabınızı aktifleştirmek için lütfen aşağıdaki bağlantıya tıklayınız:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #d53f8c; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">E-posta Adresimi Doğrula</a>
        </div>
        <p style="margin-bottom: 20px; font-size: 16px;">Bu bağlantı 24 saat boyunca geçerlidir.</p>
        <p style="margin-bottom: 20px; font-size: 16px;">Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">© ${new Date().getFullYear()} Mega Oto Tuning - Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    `,
    // Plain text alternatifi (bazı e-posta istemcileri için)
    text: `
      Merhaba ${user.name},
      
      Hesabınızı aktifleştirmek için lütfen aşağıdaki bağlantıya tıklayınız:
      ${verificationUrl}
      
      Bu bağlantı 24 saat boyunca geçerlidir.
      
      Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.
      
      © ${new Date().getFullYear()} Mega Oto Tuning - Tüm Hakları Saklıdır.
    `
  };

  try {

    // Önce transporter'ı verify edelim
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
  
          reject(error);
        } else {
          console.log('SMTP server is ready to take our messages');
          resolve(success);
        }
      });
    });
    
    // E-postayı gönderelim
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    // Hata durumunda detaylı bir nesne döndürelim
    return { 
      success: false, 
      error: error.message || 'E-posta gönderirken bir hata oluştu',
      details: error
    };
  }
}

// Şifre sıfırlama e-postası gönderme
// Genel amaçlı e-posta gönderme fonksiyonu
export async function sendEmail({ to, subject, html, text }) {
  console.log(`[EMAIL] Sending email to: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  
  const mailOptions = {
    from: `"Mega Oto Tuning" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject,
    html,
    text
  };

  try {
    console.log('[EMAIL] Attempting to send email...');
    
    // Önce transporter'ı verify edelim
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log('[EMAIL] Transporter verification error:', error);
          reject(error);
        } else {
          console.log('[EMAIL] SMTP server is ready to take our messages');
          resolve(success);
        }
      });
    });
    
    // E-postayı gönderelim
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Email sent:', info.messageId);
    
    if (info.messageId) {
      return { success: true, messageId: info.messageId };
    } else {
      return { success: true, info };
    }
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    console.error('[EMAIL] Error details:', {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    return { 
      success: false, 
      error: error.message || 'E-posta gönderirken bir hata oluştu' 
    };
  }
}

export async function sendPasswordResetEmail(user, resetUrl) {
  const mailOptions = {
    from: `"Mega Oto Tuning" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: user.email,
    subject: 'Mega Oto Tuning - Şifre Sıfırlama',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #e53935;">Mega Oto Tuning</h1>
        </div>
        <p style="margin-bottom: 20px; font-size: 16px;">Merhaba ${user.name},</p>
        <p style="margin-bottom: 20px; font-size: 16px;">Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayınız:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #d53f8c; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Şifremi Sıfırla</a>
        </div>
        <p style="margin-bottom: 20px; font-size: 16px;">Bu bağlantı 1 saat boyunca geçerlidir.</p>
        <p style="margin-bottom: 20px; font-size: 16px;">Eğer bu işlemi siz talep etmediyseniz, lütfen bu e-postayı dikkate almayınız ve hesabınızın güvenliği için bizimle iletişime geçiniz.</p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">© ${new Date().getFullYear()} Mega Oto Tuning - Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
