import mongoose from 'mongoose';

const securityAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  title: { type: String, required: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 500 },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  status: { type: String, enum: ['Open', 'Reviewed', 'Resolved', 'Escalated'], default: 'Open' },
  simulated: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.SecurityAlert || mongoose.model('SecurityAlert', securityAlertSchema);
