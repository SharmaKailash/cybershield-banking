import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  user: { type: String, required: true, maxlength: 80 },
  action: { type: String, required: true, maxlength: 80 },
  device: { type: String, required: true, maxlength: 120 },
  resource: { type: String, required: true, maxlength: 120 },
  status: { type: String, required: true, maxlength: 40 },
  risk: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  simulated: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
