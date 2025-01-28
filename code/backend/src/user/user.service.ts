import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new Error(`User with userId ${userId} not found`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      { userId },
      { $set: updateUserDto },
      { new: true },
    );
    if (!user) throw new Error('User not found');
    return user;
  }

  async delete(userId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ userId });
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
    return true;
  }

  async verifyPhone(userId: string, phoneNumber: string): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      { userId, 'phoneNumber.value': phoneNumber },
      { 'phoneNumber.verified': true },
      { new: true },
    );
    if (!user) throw new Error('User not found or phone number mismatch');
    return user;
  }

  async verifyEmail(userId: string, email: string): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      { userId, 'email.value': email },
      { 'email.verified': true },
      { new: true },
    );
    if (!user) throw new Error('User not found or email mismatch');
    return user;
  }

  async linkAccount(
    userId: string,
    provider: 'google' | 'apple' | 'facebook',
    accountData: Record<string, any>, 
  ): Promise<User> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }
  
    user.linkedAccounts[provider] = {
      ...user.linkedAccounts[provider],
      ...accountData,                 
    };
  
    user.markModified(`linkedAccounts.${provider}`);
  
    return user.save();
  }

  async checkExistingUser(phoneNumber?: string, email?: string, accountId?: string, provider?: string): Promise<boolean> {
    if (phoneNumber) {
      return !!(await this.userModel.findOne({ 'phoneNumber.value': phoneNumber }));
    }
    if (email) {
      return !!(await this.userModel.findOne({ 'email.value': email }));
    }
    if (accountId && provider) {
      return !!(await this.userModel.findOne({ [`linkedAccounts.${provider}`]: accountId }));
    }
    return false;
  }
}
