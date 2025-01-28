import { createDecipheriv } from 'crypto';
import { Schema, model, Document } from 'mongoose';

export interface OTPAuth extends Document {
  verificationId?: string;
  step: 'send' | 'verify' | 'login';
  phoneNumber?: string;
  ipAddress: string;
  status: 'pending' | 'verified' | 'failed' | 'expired';
  success: boolean;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; 
}

export const OTPAuthSchema = new Schema<OTPAuth>({
  verificationId: { type: String, required: true, unique: true },
  step: { type: String, required: true, enum: ['send', 'verify', 'login'] },
  phoneNumber: { type: String },
  ipAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'failed', 'expired'], required: true },
  success: { type: Boolean, required: true },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, 
}, { timestamps: true });

OTPAuthSchema.index({ createdAt: 1 });
OTPAuthSchema.index({ verificationId: 1, status: 1 });
OTPAuthSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPAuthModel = model<OTPAuth>('AuthRecord', OTPAuthSchema);
