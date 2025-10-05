import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  type: { type: String, required: true }, // ör: 'order', 'payment', 'user'
  message: { type: String, required: true },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Log || mongoose.model('Log', logSchema); 