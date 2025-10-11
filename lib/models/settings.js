import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountHolder: { type: String, required: true },
  iban: { type: String, required: true },
  paytrEnabled: { type: Boolean, default: false },
  ibanEnabled: { type: Boolean, default: true }, // Banka Transferi ödeme yöntemi aktif/pasif
}, { timestamps: true });

let Settings;
if (typeof window === 'undefined') {
  Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
} else {
  Settings = {};
}

export default Settings; 