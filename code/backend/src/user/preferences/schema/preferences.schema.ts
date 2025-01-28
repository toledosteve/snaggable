import { Schema, Document, model, Types } from 'mongoose';

export interface UserPreferences extends Document {
  user: Types.ObjectId; 
  preferredGender: string;
  ageRange: { min: number; max: number };
  maxDistance: number;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserPreferencesSchema = new Schema<UserPreferences>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    preferredGender: { type: String, default: 'all' },
    ageRange: { min: { type: Number, default: 18 }, max: { type: Number, default: 99 } },
    maxDistance: { type: Number, default: 50 },
    interests: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const UserPreferencesModel = model<UserPreferences>('UserPreferences', UserPreferencesSchema);
