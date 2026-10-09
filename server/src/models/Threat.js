import mongoose from 'mongoose';

const threatSchema = new mongoose.Schema({
  threatId: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 120 },
  cause: { type: String, required: true, maxlength: 300 },
  method: { type: String, required: true, maxlength: 300 },
  impact: { type: String, required: true, maxlength: 300 },
  mitigation: { type: String, required: true, maxlength: 300 },
  likelihood: { type: Number, min: 1, max: 4, required: true },
  severity: { type: Number, min: 1, max: 4, required: true },
  risk: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
}, { timestamps: true });

export default mongoose.models.Threat || mongoose.model('Threat', threatSchema);
