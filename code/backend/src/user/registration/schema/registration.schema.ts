import { Schema, Document, model } from "mongoose";

export interface Registration extends Document {
    registrationId: string;
    loginMethod: 'facebook' | 'apple' | 'google' | 'otp';
    phoneNumber?: string;
    email?: string;
    stepsCompleted: string[];
    registrationData: Map<string, any>;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date; 
}

export interface RegistrationAudit extends Document {
    registrationId: string;
    status: 'abandoned' | 'completed';
    stepsCompleted: string[];
    createdAt: Date;
    completedAt: Date;
}

export const RegistrationSchema = new Schema<Registration>({
    registrationId: { type: String, required: true, unique: true },
    loginMethod: { type: String, enum: ['facebook', 'apple', 'google', 'otp'], required: true },
    phoneNumber: { type: String },
    email: { type: String },
    stepsCompleted: { type: [String], default: [] },
    registrationData: {
        type: Map,
        of: Schema.Types.Mixed, 
        default: {},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, 
}, { timestamps: true });

export const RegistrationAuditSchema = new Schema<RegistrationAudit>({
    registrationId: { type: String, required: true },
    status: { type: String, enum: ["abandoned", "completed"], required: true },
    createdAt: { type: Date, required: true },
    completedAt: { type: Date },
    stepsCompleted: { type: [String], default: [] },
});
  
RegistrationSchema.index({ loginMethod: 1, phoneNumber: 1, email: 1 }, { unique: true });
RegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RegistrationModel = model<Registration>('Registration', RegistrationSchema);