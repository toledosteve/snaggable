import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schema/client.schema';

@Injectable()
export class ClientService {
  constructor(@InjectModel('Client') private readonly clientModel: Model<Client>) {}

  async addClient(clientId: string, clientSecret: string, clientName: string): Promise<Client> {
    const client = new this.clientModel({
      clientId,
      clientSecret,
      clientName,
      isActive: true,
    });

    return await client.save();
  }

  async listClients(): Promise<Client[]> {
    return this.clientModel.find();
  }

  async deactivateClient(clientId: string): Promise<Client | null> {
    return this.clientModel.findOneAndUpdate(
      { clientId },
      { isActive: false },
      { new: true },
    );
  }
}
