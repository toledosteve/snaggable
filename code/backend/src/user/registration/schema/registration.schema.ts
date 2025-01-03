import { Schema, Document, model } from "mongoose";

export interface Registration extends Document {
    registrationId: string;
    phoneNumber: string;
    verificationId: string;
    verificationStatus: 'pending' | 'verified' | 'expired';
    phoneVerified: boolean;
    stepsCompleted: string[];
    registrationData: Map<string, any>;
    loginMethod: 'facebook' | 'apple' | 'phone';
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date; 
}

export interface RegistrationAudit extends Document {
    registrationId: string;
    status: 'abandoned' | 'completed' | 'unverified';
    stepsCompleted: string[];
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
    registrationData: {
        type: Map,
        of: Schema.Types.Mixed, 
        default: {},
      },
    loginMethod: { type: String, enum: ['facebook', 'apple', 'phone'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, 
}, { timestamps: true });

export const RegistrationAuditSchema = new Schema<RegistrationAudit>({
    registrationId: { type: String, required: true },
    status: { type: String, enum: ["abandoned", "completed", "unverified"], required: true },
    createdAt: { type: Date, required: true },
    completedAt: { type: Date },
    stepsCompleted: { type: [String], default: [] },
});
  
RegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RegistrationModel = model<Registration>('Registration', RegistrationSchema);