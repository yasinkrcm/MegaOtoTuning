import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen ürün adı giriniz'],
    maxlength: [100, 'Ürün adı 100 karakterden fazla olamaz'],
  },
  description: {
    type: String,
    required: [true, 'Lütfen ürün açıklaması giriniz'],
  },
  price: {
    type: Number,
    required: [true, 'Lütfen fiyat giriniz'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Lütfen bir görsel URL\'si giriniz'],
  },
  category: {
    type: String,
    enum: ['Aksesuar', 'Parça'],
    default: 'Aksesuar',
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Client-side'da çalışıyorsak boş bir obje dönelim
// Server-side'da çalışıyorsak normal modeli dönelim
let Product;

if (typeof window === 'undefined') {
  // Server-side'da çalışıyoruz
  Product = mongoose.models.Product || mongoose.model('Product', productSchema);
} else {
  // Client-side'da çalışıyoruz, boş bir obje dönelim
  Product = {};
}

export default Product;
