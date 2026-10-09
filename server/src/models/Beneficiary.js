import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  customerId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  accountNumberMasked: { type: String, required: true, maxlength: 40 },
  isDemo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Beneficiary || mongoose.model('Beneficiary', beneficiarySchema);
