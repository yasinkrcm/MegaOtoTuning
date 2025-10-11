import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['iletildi', 'hazırlanıyor', 'kargoya verildi', 'ulaştı', 'iptal edildi', 'ödeme-bekliyor', 'onaylandı', 'iptal', 'ödeme-bildirimi-yapıldı'],
    default: 'iletildi',
  },
  paymentMethod: {
    type: String,
    enum: ['Banka Transferi', 'PayTR', 'PayTR-EFT'],
    required: true,
    default: 'Banka Transferi',
  },
  // PayTR ile ilgili alanlar
  paytrStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    required: false,
  },
  paytrTransactionId: {
    type: String,
    required: false,
  },
  paytrFailedReason: {
    type: String,
    required: false,
  },
  paytrFailedReasonCode: {
    type: String,
    required: false,
  },
  paytrOrderId: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false, // Opsiyonel yaptık
  },
  notes: {
    type: String,
    required: false,
  },
  cargoCompany: {
    type: String,
    required: false,
  },
  cargoTrackingNumber: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Client-side'da çalışıyorsak boş bir obje dönelim
// Server-side'da çalışıyorsak normal modeli dönelim
let Order;

if (typeof window === 'undefined') {
  // Server-side'da çalışıyoruz
  Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
} else {
  // Client-side'da çalışıyoruz, boş bir obje dönelim
  Order = {};
}

export default Order;
