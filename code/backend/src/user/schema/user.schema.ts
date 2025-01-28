import { Schema, Document, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface User extends Document {
  userId: string; 
  name: string;
  phoneNumber: { value: string; verified: boolean }; 
  email: { value: string; verified: boolean }; 
  linkedAccounts: {
    google?: {
      id: string;
      email?: string;
      accessToken?: string;
      refreshToken?: string;
    }; 
    apple?: {
      id: string;
      email?: string;
      accessToken?: string;
      refreshToken?: string;
    } 
    facebook?: {
      id: string;
      email?: string;
      accessToken?: string;
      refreshToken?: string;
    }; 
  };
  acceptPledge: boolean; 
}

export const UserSchema = new Schema<User>(
  {
    userId: { 
      type: String, 
      required: true, 
      unique: true, 
      default: uuidv4,
      validate: {
        validator: (value: string) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
        message: 'Invalid UUID format',
      }, 
    },
    name: { type: String, required: true },
    phoneNumber: {
      value: { type: String, required: true, unique: true },
      verified: { type: Boolean, default: false },
    },
    email: {
      value: { type: String, required: true, unique: true },
      verified: { type: Boolean, default: false },
    },
    linkedAccounts: {
      google: {
        id: { type: String, unique: true},
        email: { type: String },
      },
      apple: {
        id: { type: String, unique: true },
        email: { type: String },
      },
      facebook: {
        id: { type: String, unique: true },
        email: { type: String },
      },
    },    
    acceptPledge: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = model<User>('User', UserSchema);
