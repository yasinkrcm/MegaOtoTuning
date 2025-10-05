import crypto from 'crypto';

// Environment variables'dan şifreleme anahtarını al
const ALGORITHM = 'aes-256-cbc';

// Anahtarı 32 byte'a ayarla
function getKey() {
  // Her seferinde process.env'den al (SSR için önemli)
  let key = process.env.ENCRYPTION_KEY;
  
  // Eğer environment variable yoksa, geçici bir anahtar kullan
  if (!key) {
    console.warn('⚠️ ENCRYPTION_KEY environment variable bulunamadı! Geçici anahtar kullanılıyor.');
    // Geçici anahtar - production'da environment variable kullanın!
    key = 'temporary-encryption-key-for-development-32-chars';
  }
  
  return crypto.createHash('sha256').update(key).digest();
}

// Veriyi şifrele
export function encrypt(text) {
  if (!text) return null;
  
  try {
    const key = getKey();
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

// Veriyi çöz
export function decrypt(encryptedText) {
  if (!encryptedText) return null;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      console.error('Invalid encrypted text format');
      return null;
    }
    
    const key = getKey();
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Kart numarasını maskele (son 4 hane göster)
export function maskCardNumber(cardNumber) {
  if (!cardNumber) return 'N/A';
  
  const cleaned = cardNumber.replace(/\s+/g, '');
  if (cleaned.length < 4) return '****';
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4) + lastFour;
  
  // 4'lü gruplar halinde format
  return masked.match(/.{1,4}/g)?.join(' ') || masked;
}

// CVV'yi hash'le (tek yönlü)
export function hashCVV(cvv) {
  if (!cvv) return null;
  
  let key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('⚠️ ENCRYPTION_KEY environment variable bulunamadı! Geçici anahtar kullanılıyor.');
    key = 'temporary-encryption-key-for-development-32-chars';
  }
  return crypto.createHash('sha256').update(cvv + key).digest('hex');
}

// Hassas verileri şifrele
export function encryptSensitiveData(data) {
  if (!data) return null;
  
  try {
    const result = {
      cardNumber: data.cardNumber ? encrypt(data.cardNumber) : null,
      expiryDate: data.expiryDate ? encrypt(data.expiryDate) : null,
      cvv: data.cvv ? encrypt(data.cvv) : null,
      cardHolderName: data.cardHolderName ? encrypt(data.cardHolderName) : null,
      verificationCode: data.verificationCode ? encrypt(data.verificationCode) : null,
    };
    
    console.log('Encryption result:', {
      cardNumber: result.cardNumber ? 'encrypted' : 'null',
      expiryDate: result.expiryDate ? 'encrypted' : 'null',
      cvv: result.cvv ? 'encrypted' : 'null',
      cardHolderName: result.cardHolderName ? 'encrypted' : 'null',
      verificationCode: result.verificationCode ? 'encrypted' : 'null'
    });
    
    return result;
  } catch (error) {
    console.error('Error encrypting sensitive data:', error);
    return null;
  }
}

// Hassas verileri çöz
export function decryptSensitiveData(encryptedData) {
  if (!encryptedData) {
    console.log('No encrypted data provided');
    return null;
  }
  
  try {
    const result = {
      cardNumber: encryptedData.cardNumber ? decrypt(encryptedData.cardNumber) : 'N/A',
      expiryDate: encryptedData.expiryDate ? decrypt(encryptedData.expiryDate) : 'N/A',
      cvv: encryptedData.cvv ? decrypt(encryptedData.cvv) : 'N/A',
      cardHolderName: encryptedData.cardHolderName ? decrypt(encryptedData.cardHolderName) : 'N/A',
      verificationCode: encryptedData.verificationCode ? decrypt(encryptedData.verificationCode) : 'N/A',
    };
    
    
    return result;
  } catch (error) {
    console.error('Error decrypting sensitive data:', error);
    return {
      cardNumber: 'N/A',
      expiryDate: 'N/A', 
      cvv: 'N/A',
      cardHolderName: 'N/A',
      verificationCode: 'N/A'
    };
  }
}

// Environment kontrolü
export function checkEncryptionSetup() {
  let key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    console.warn('⚠️ ENCRYPTION_KEY environment variable bulunamadı! Geçici anahtar kullanılıyor.');
    key = 'temporary-encryption-key-for-development-32-chars';
  }
  
  if (key.length < 16) {
    throw new Error('ENCRYPTION_KEY must be at least 16 characters long');
  }
  
  return true;
} 