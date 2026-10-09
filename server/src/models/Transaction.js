import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  customerId: { type: String, required: true, index: true },
  beneficiary: { type: String, required: true, maxlength: 100 },
  amount: { type: Number, required: true, min: 1, max: 100000 },
  purpose: { type: String, required: true, maxlength: 60 },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  status: { type: String, enum: ['NORMAL', 'REVIEW', 'BLOCKED', 'APPROVAL_REQUIRED', 'APPROVED', 'REJECTED'], required: true },
  simulated: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
