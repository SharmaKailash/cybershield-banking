import mongoose from 'mongoose';

const securityEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  event: { type: String, required: true, maxlength: 60 },
  user: { type: String, required: true, maxlength: 80 },
  source: { type: String, required: true, maxlength: 120 },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  status: { type: String, enum: ['Open', 'Reviewed', 'Resolved'], default: 'Open' },
  simulated: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.SecurityEvent || mongoose.model('SecurityEvent', securityEventSchema);
