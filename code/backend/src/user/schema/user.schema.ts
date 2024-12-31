import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  userId: string; 
  phoneNumber?: string; 
  phoneVerified: boolean;
  email?: string; 
  name: string;
  dob: { day: number; month: string; year: number };
  gender: string;
  photos: string[]; 
  location: { lat: number; lon: number } | null;
  showGender: boolean;
  acceptPledge: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    userId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    dob: {
      day: { type: Number, required: true },
      month: { type: String, required: true },
      year: { type: Number, required: true },
    },
    gender: { type: String, required: true },
    photos: { type: [String], default: [] },
    location: { type: Object, default: null },
    showGender: { type: Boolean, default: true },
    acceptPledge: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);