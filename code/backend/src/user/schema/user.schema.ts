import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  userId: string; // Unique user identifier (UUID)
  phoneNumber?: string; // For phone-based login
  email?: string; // For email-based login (optional)
  name: string;
  dob: { day: number; month: string; year: number };
  gender: string;
  photos: string[]; // URLs or paths to uploaded photos
  location: { lat: number; lon: number } | null;
  showGender: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    userId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);