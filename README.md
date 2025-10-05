# 🚗 MegaOtoTuning

> Modern E-Ticaret Platformu - Oto Tuning Malzemeleri

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.1-green?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PayTR](https://img.shields.io/badge/PayTR-API-orange?style=flat-square)](https://paytr.com/)

## 🏷️ Proje Tanıtımı

**MegaOtoTuning**, oto tuning malzemeleri satışı yapan modern bir e-ticaret platformudur. Kullanıcı dostu arayüzü, güvenli ödeme sistemi ve kapsamlı yönetim paneli ile profesyonel bir alışveriş deneyimi sunar.

### ✨ Temel Özellikler

- 🛍️ **Ürün Kataloğu**: Kategorize edilmiş ürün listesi ve detay sayfaları
- 🛒 **Sepet Sistemi**: Kullanıcı bazlı sepet yönetimi ve localStorage entegrasyonu
- 💳 **Güvenli Ödeme**: PAYTR API ile güvenli kredi kartı ödemeleri
- 👤 **Kullanıcı Yönetimi**: Kayıt, giriş ve profil yönetimi
- 📦 **Sipariş Takibi**: Detaylı sipariş durumu ve takip sistemi
- 🎛️ **Admin Paneli**: Kapsamlı yönetim ve raporlama araçları
- 📱 **Responsive Tasarım**: Mobil uyumlu modern arayüz
- 🔔 **Gerçek Zamanlı Bildirimler**: Toast mesajları ve sistem logları

### 🌐 Canlı Site

**🔗 [megaototuning.com](https://megaototuning.com)**

---

## ⚙️ Teknolojiler

### Frontend
- **Next.js 14.2.5** - React framework ve SSR/SSG desteği
- **React 18.3.1** - Modern UI kütüphanesi
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion** - Animasyon ve geçiş efektleri
- **React Hot Toast** - Bildirim sistemi

### Backend & Database
- **Next.js API Routes** - Serverless backend yapısı
- **MongoDB 8.16.1** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **NextAuth.js** - Kimlik doğrulama sistemi
- **bcryptjs** - Şifre hashleme
- **JWT** - Token tabanlı yetkilendirme

### Ödeme & Entegrasyonlar
- **PayTR API** - Türkiye'nin önde gelen ödeme sağlayıcısı
- **Vercel Analytics** - Performans ve kullanıcı analizi
- **Cloudinary** - Görsel yönetimi

### Deployment
- **Vercel** - Serverless deployment platformu
- **MongoDB Atlas** - Bulut veritabanı hizmeti

---

## 💳 PAYTR API Entegrasyonu Açıklaması

Proje, Türkiye'nin güvenilir ödeme sağlayıcısı **PayTR** ile tam entegre çalışmaktadır:

### 🔐 Güvenlik Özellikleri
- **HMAC-SHA256** ile token doğrulama
- **3D Secure** destekli güvenli ödeme
- **Fraud detection** ve risk yönetimi
- **PCI DSS** uyumlu güvenlik standartları

### 💰 Ödeme Akışı
1. **Sepet Onayı**: Kullanıcı sepeti onaylar
2. **PayTR Token**: Güvenli ödeme token'ı oluşturulur
3. **3D Secure**: Banka doğrulama süreci
4. **Callback**: Ödeme sonucu otomatik bildirim
5. **Sipariş Güncelleme**: Durum otomatik güncellenir

### 🛠️ Teknik Implementasyon
```javascript
// PayTR token oluşturma
const token_string = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;
const paytr_token = crypto.createHmac('sha256', merchant_key)
  .update(token_string)
  .digest('base64');
```

---

## ☁️ Serverless Backend Mimarisi

Proje, modern **serverless** mimari prensiplerine uygun olarak tasarlanmıştır:

### 🏗️ Mimari Yapı
- **API Routes**: Next.js serverless functions
- **Database**: MongoDB Atlas (bulut veritabanı)
- **Authentication**: NextAuth.js ile JWT tabanlı kimlik doğrulama
- **File Storage**: Cloudinary entegrasyonu
- **Deployment**: Vercel platformu

### ⚡ Performans Optimizasyonları
- **Static Generation**: Ürün sayfaları için SSG
- **Incremental Static Regeneration**: Dinamik içerik güncellemeleri
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Otomatik bundle optimizasyonu
- **Caching**: MongoDB connection pooling

### 🔄 Veri Akışı
```
Client → API Route → MongoDB → Response
   ↓
PayTR API ← Token Generation ← Order Processing
```

---

## 🚀 Kurulum ve Çalıştırma

### 📋 Gereksinimler
- Node.js 18+ 
- MongoDB Atlas hesabı
- PayTR merchant hesabı

### 🔧 Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone https://github.com/yasinkrcm/megaototuning.git
cd megaototuning
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
# .env.local dosyası oluşturun
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# PayTR ayarları
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt

# Google Search Console
GOOGLE_VERIFICATION_CODE=your-verification-code
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

### 🏗️ Production Build
```bash
npm run build
npm start
```

### 📊 Veritabanı Kurulumu
```bash
# Kullanıcı doğrulama scripti
npm run update-users
```

---

## 🌐 Canlı Site Bağlantısı

**🔗 [megaototuning.com](https://megaototuning.com)**

- ✅ SSL sertifikası aktif
- ✅ CDN optimizasyonu
- ✅ Mobile-first responsive tasarım
- ✅ SEO optimizasyonu
- ✅ Analytics entegrasyonu

---

## 👨‍💻 Geliştirici Hakkında

**Yasin KARAÇAM** - Full Stack Developer & Freelancer

### 💼 Profesyonel Deneyim
- **3+ yıl** web geliştirme deneyimi
- **Modern JavaScript** ekosistemi 
- **E-ticaret** ve **fintech** projelerinde uzmanlaşma
- **API entegrasyonları** ve **ödeme sistemleri** konusunda deneyim

### 🛠️ Teknik Uzmanlık
- **Frontend**: React, Next.js, Vue.js, TypeScript
- **Backend**: Node.js, Express, MongoDB, PostgreSQL
- **Ödeme**: PayTR, İyzico, Stripe entegrasyonları
- **DevOps**: Vercel, AWS, Docker, CI/CD
- **UI/UX**: Tailwind CSS, Material-UI, Responsive Design

### 🎯 Hizmet Alanları
- E-ticaret platformları
- Kurumsal web uygulamaları
- API geliştirme ve entegrasyon
- Ödeme sistemi entegrasyonları
- Mobil uyumlu responsive tasarım

---

## 📞 Destek / İletişim

**📧 E-posta**: yasinkaracam67@gmail.com  
**💼 LinkedIn**: [Yasin KARAÇAM](https://linkedin.com/in/yasinkaracamm)  
**🐙 GitHub**: [@yasinkaracam](https://github.com/yasinkrcm)

### 🤝 İş Birliği
- Freelance projeler için uygun
- Uzun vadeli iş birlikleri kabul edilir
- Teknik danışmanlık hizmetleri
- Kod review ve optimizasyon

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by [Yasin KARAÇAM](https://github.com/yasinkrcm)

</div>
