import { Schema, Document } from "mongoose";

export interface Registration extends Document {
    registrationId: string;
    phoneNumber: string;
    verificationId: string;
    verificationStatus: 'pending' | 'verified' | 'expired';
    phoneVerified: boolean;
    stepsCompleted: string[];
    registrationData: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date; 
}

export interface RegistrationAudit extends Document {
    registrationId: string;
    status: 'abandoned' | 'completed' | 'unverified';
    stepsCompleted: string[];
    registrationData: Record<string, any>;
    createdAt: Date;
    completedAt: Date;
}

export const RegistrationSchema = new Schema<Registration>({
    registrationId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    verificationId: { type: String, required: true },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'expired'], default: 'pending' },
    phoneVerified: { type: Boolean, default: false },
    stepsCompleted: { type: [String], default: [] },
    registrationData: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, 
});

export const RegistrationAuditSchema = new Schema<RegistrationAudit>({
    registrationId: { type: String, required: true },
    status: { type: String, enum: ["abandoned", "completed", "unverified"], required: true },
    createdAt: { type: Date, required: true },
    completedAt: { type: Date },
    stepsCompleted: { type: [String], default: [] },
});
  
RegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });