import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: { type: String, enum: ['customer', 'admin', 'checker'], required: true },
  passwordHash: { type: String, required: true, select: false },
  passwordSalt: { type: String, required: true, select: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
