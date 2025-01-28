import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto/profile.dto';
import { UserProfile } from './schema/profile.schema';
import { User } from '../schema/user.schema';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel('UserProfile') private readonly userProfileModel: Model<UserProfile>,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  // Create a new user profile
  async create(userId: string, createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    const user = await this.userModel.findOne({ userId: userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    
    const existingProfile = await this.userProfileModel.findOne({ user: user._id }).exec();
    if (existingProfile) {
      throw new Error('User profile already exists');
    }

    const profileData = { ...createUserProfileDto, user: user._id };
    const profile = new this.userProfileModel(profileData);
    return profile.save();
  }

  // Find a profile by user ID
  async findByUserId(userId: string): Promise<UserProfile | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    return this.userProfileModel.findOne({ user: user._id }).populate('user').exec();
  }

  // Find all profiles
  async findAll(): Promise<UserProfile[]> {
    return this.userProfileModel.find().populate('user').exec();
  }

  // Update a user profile
  async update(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }


    return this.userProfileModel
      .findOneAndUpdate({ user: user._id }, updateUserProfileDto, { new: true })
      .exec();
  }

  // Delete a user profile
  async delete(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.userProfileModel.deleteOne({ user: user._id }).exec();
    return result.deletedCount > 0;
  }

  // Add a photo to the user's profile
  async addPhoto(userId: string, photoUrl: string): Promise<UserProfile | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    return this.userProfileModel
      .findOneAndUpdate({ user: user._id }, { $push: { photos: photoUrl } }, { new: true })
      .exec();
  }

  // Remove a photo from the user's profile
  async removePhoto(userId: string, photoUrl: string): Promise<UserProfile | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    return this.userProfileModel
      .findOneAndUpdate({ user: user._id }, { $pull: { photos: photoUrl } }, { new: true })
      .exec();
  }

  // Check if a profile exists for the user
  async checkExistingProfile(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.userProfileModel.findOne({ user: user._id }).exec();
    return !!profile;
  }
}
