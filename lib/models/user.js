import mongoose from 'mongoose';

// Server-side kodda çalıştığımızdan emin olalım
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen ad soyad giriniz'],
    maxlength: [60, 'Ad soyad 60 karakterden fazla olamaz'],
  },
  email: {
    type: String,
    required: [true, 'Lütfen bir e-posta giriniz'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Lütfen bir şifre giriniz'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  kvkkConsent: {
    type: Boolean,
    required: true,
    default: false,
  },
  kvkkConsentDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Client-side'da çalışıyorsak boş bir obje dönelim
// Server-side'da çalışıyorsak normal modeli dönelim
let User;

if (typeof window === 'undefined') {
  // Server-side'da çalışıyoruz
  User = mongoose.models.User || mongoose.model('User', userSchema);
} else {
  // Client-side'da çalışıyoruz, boş bir obje dönelim
  User = {};
}

export default User;
