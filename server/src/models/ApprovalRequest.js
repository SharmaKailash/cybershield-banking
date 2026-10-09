import mongoose from 'mongoose';

const approvalRequestSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  maker: { type: String, required: true },
  checker: { type: String },
  beneficiary: { type: String, required: true, maxlength: 100 },
  amount: { type: Number, required: true, min: 1, max: 100000 },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  simulated: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ApprovalRequest || mongoose.model('ApprovalRequest', approvalRequestSchema);
