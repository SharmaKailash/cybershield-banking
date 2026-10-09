import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  customerId: { type: String, required: true, index: true },
  accountNumberMasked: { type: String, required: true },
  accountType: { type: String, enum: ['Current', 'Savings'], required: true },
  balance: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
