import { Schema, Document, model } from 'mongoose';

export interface Verification extends Document {
  phoneNumber: string; // E.164 format (+1234567890)
  verificationId: string;
  status: 'pending' | 'verified' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Define the schema once
const VerificationSchema = new Schema<Verification>(
  {
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\+[1-9]\d{1,14}$/.test(v), // E.164 validation
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    verificationId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'verified', 'expired'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Create TTL index for automatic expiry
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Optimize queries for phoneNumber and verificationId
VerificationSchema.index({ phoneNumber: 1, verificationId: 1 });

// Export the schema and the model
export { VerificationSchema }; // Export for NestJS MongooseModule
export const VerificationModel = model<Verification>('Verification', VerificationSchema); // Export for direct use
