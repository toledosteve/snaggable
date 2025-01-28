import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationAudit } from '../schema/registration.schema';
import { UserService } from './../../user.service';
import { UserProfileService } from './../../profile/user-profile.service';
import { User } from './../../schema/user.schema';
import { stepsRegistry, stepsOrder } from '../config/steps.config';
import { CreateUserDto } from './../../dto/user.dto';
import { PhotoService } from '../../../shared/photo/photo-upload.service';
import { CreateUserProfileDto } from '../../profile/dto/profile.dto';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly photoService: PhotoService,
        @InjectModel('Registration') private readonly registrationModel: Model<Registration>,
        @InjectModel('RegistrationAudit') private readonly registrationAuditModel: Model<RegistrationAudit>,
    ) {}

    async start(data: Record<string, any>): Promise<{ registrationId: string }> {
        const { loginMethod, phoneNumber, email } = data;

        const existingUser = await this.userService.checkExistingUser(loginMethod, phoneNumber, email);
        if (existingUser) {
            throw new Error(
                `A user already exists with ${
                    loginMethod === 'otp' ? `phone number: ${phoneNumber}` : `email: ${email}`
                }. Please log in instead.`
            );
        }

        const existingRegistration = await this.registrationModel.findOne({
            loginMethod,
            ...(loginMethod === 'otp' && phoneNumber ? { phoneNumber } : {}),
            ...(loginMethod !== 'otp' && email ? { email } : {}),
            expiresAt: { $gte: new Date() },
          });
        
          if (existingRegistration) {
            throw new Error(
              `A pending registration already exists for ${
                loginMethod === 'otp' ? `phone number: ${phoneNumber}` : `email: ${email}`
              }`
            );
        }

        const registrationId = crypto.randomUUID();
    
        const registration = new this.registrationModel({
          registrationId,
          loginMethod: loginMethod,
          phoneNumber: loginMethod === 'otp' ? phoneNumber : undefined,
          email: ['otp', 'facebook', 'google', 'apple'].includes(loginMethod) ? email : undefined,
          stepsCompleted: ['start'],
          registrationData: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration to 24 hours
        });
    
        await registration.save();
        return registration;
    }

    async register(registrationId: string, stepKey: string, stepData: Record<string, any>): Promise<{ message: string, nextStep?: string }> {
        if (!registrationId) {
            throw new Error('registrationId is required for this step.');
        }
        
        const registration = await this.registrationModel.findOne({
            registrationId,
            expiresAt: { $gte: new Date() },
        });
    
        if (!registration) {
            throw new Error('Invalid or expired registration ID.');
        }
    
        if (registration.stepsCompleted.includes(stepKey)) {
            throw new Error(`Step "${stepKey}" has already been completed.`);
        }
    
        const expectedStep = stepsOrder[registration.stepsCompleted.length];
        if (stepKey !== expectedStep) {
            throw new Error(`Step "${stepKey}" is out of order. Expected step: "${expectedStep}".`);
        }
    
        // Save step data
        registration.stepsCompleted.push(stepKey);
        registration.registrationData.set(stepKey, stepData);
        registration.updatedAt = new Date();
        await registration.save();
    
        const nextStep = stepsOrder[registration.stepsCompleted.length];
        return {
            message: 'Step saved successfully.',
            nextStep,
        };
    }

    async complete(registrationId: string): Promise<User | boolean> {
        const registration = await this.registrationModel.findOne({
            registrationId,
            verificationStatus: 'verified',
            expiresAt: { $gte: new Date() },
        });
    
        if (!registration) {
            throw new Error('Invalid registration ID');
        }

        const registrationData = Object.fromEntries(registration.registrationData);

        const photos = Array.isArray(registrationData.photos?.photos)
            ? registrationData.photos.photos
            : registrationData.photos || [];

        const createUserDto: CreateUserDto = {
            userId: registrationId,
            name: registrationData.name,
            phoneNumber: {
                value: registrationData.phoneNumber.value,
                verified: registrationData.phoneNumber.verified || false,
            },
            email: {
                value: registrationData.email.value,
                verified: registrationData.email.verified || false,
            },
            google: registrationData.google ? {
                id: registrationData.google.id,
                email: registrationData.google.email,
            } : undefined,
            apple: registrationData.apple ? {
                id: registrationData.apple.id,
                email: registrationData.apple.email,
            } : undefined,
            facebook: registrationData.facebook ? {
                id: registrationData.facebook.id,
                email: registrationData.facebook.email,
            } : undefined,
            acceptPledge: registrationData.pledge?.acceptPledge ?? false,
        };

        const user = await this.userService.create(createUserDto);

        const createUserProfileDto: CreateUserProfileDto = {
            aboutMe: registrationData.aboutMe || '',
            vitals: {
              dob: registrationData.dob || null,
              height: registrationData.height || null,
              location: registrationData.location || null,
            },
            identity: {
              gender: registrationData.gender,
              showGender: registrationData.showGender ?? true,
              interestedIn: registrationData.interestedIn || [],
            },
            photos: photos,
          };
        
          await this.userProfileService.create(user.userId,createUserProfileDto);
    
        await this.registrationAuditModel.create({
            registrationId,
            status: 'completed',
            stepsCompleted: registration.stepsCompleted,
            createdAt: registration.createdAt,
            completedAt: new Date(),
        });
    
        await this.registrationModel.deleteOne({ registrationId });

        return user;
    }

    async savePhotos(registrationId: string, files: Express.Multer.File[]): Promise<{ urls: string[] }> {
        const registration = await this.registrationModel.findOne({
            registrationId,
            verificationStatus: 'verified',
            expiresAt: { $gte: new Date() },
        });

        if (!registration) {
            throw new Error('Invalid registration ID');
        }

        const uploadedUrls = [];
        for (const file of files) {
            const url = await this.photoService.uploadPhoto(file, registrationId);
            uploadedUrls.push(url);
        }

        registration.registrationData.set('photos', { photos: uploadedUrls }); 
        if (!registration.stepsCompleted.includes('photos')) {
            registration.stepsCompleted.push('photos');
        }
        registration.updatedAt = new Date();
        await registration.save();

        return { urls: uploadedUrls };
    }

    async getState(registrationId: string): Promise<{ 
        phoneNumber: string;
        currentStep: string;
        nextStep: string | undefined;
        description: string;
        registrationData: Record<string, any>; 
      }> {
        const registration = await this.registrationModel.findOne({
          registrationId,
          expiresAt: { $gte: new Date() },
        });
      
        if (!registration) {
          throw new Error("Invalid or expired registration ID.");
        }
      
        const currentStepKey =
          registration.stepsCompleted.length < stepsOrder.length
            ? stepsOrder[registration.stepsCompleted.length]
            : "complete";

        const nextStepKey =
            registration.stepsCompleted.length < stepsOrder.length
              ? stepsOrder[registration.stepsCompleted.length+1]
              : undefined;
      
        const currentStepInfo = stepsRegistry[currentStepKey];
      
        return {
          phoneNumber: registration.phoneNumber,
          currentStep: currentStepKey,
          description: currentStepInfo?.description || "Complete",
          nextStep: nextStepKey,
          registrationData: Object.fromEntries(registration.registrationData), // Ensure this field is returned
        };
    }      
      
    async cleanupExpiredRegistrations(): Promise<void> {
        const expiredRegistrations = await this.registrationModel.find({
            expiresAt: { $lt: new Date() },
        });
    
        for (const registration of expiredRegistrations) {
            const status = 'abandoned';
        
            await this.registrationAuditModel.create({
                registrationId: registration.registrationId,
                status,
                stepsCompleted: registration.stepsCompleted,
                createdAt: registration.createdAt,
                expiredAt: new Date(),
            });
        
            await this.registrationModel.deleteOne({ registrationId: registration.registrationId });
        }
    }
}
