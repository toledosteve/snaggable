import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schema/client.schema';

@Injectable()
export class ClientAuthService {
  constructor(@InjectModel('Client') private readonly clientModel: Model<Client>) {}

  async authenticate(clientId: string, clientSecret: string): Promise<boolean> {
    const client = await this.clientModel.findOne({ clientId, clientSecret, isActive: true });
    if (!client) {
      throw new Error('Invalid client credentials.');
    }
    return true;
  }
}
