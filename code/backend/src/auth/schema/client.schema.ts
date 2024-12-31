import { Schema, Document, model } from 'mongoose';

export interface Client extends Document {
  clientId: string;
  clientSecret: string;
  clientName: string;
  isActive: boolean;
}

export const ClientSchema = new Schema<Client>({
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  clientName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const ClientModel = model<Client>('Client', ClientSchema);
