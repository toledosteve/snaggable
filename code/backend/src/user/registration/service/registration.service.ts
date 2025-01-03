import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationAudit } from '../schema/registration.schema';
import { PhoneVerificationService } from 'src/verification/phone-verification.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/user.schema';
import { stepsRegistry, stepsOrder } from '../config/steps.config';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { PhotoService } from 'src/photo/photo-upload.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly verificationService: PhoneVerificationService,
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
        @InjectModel('Registration') private readonly registrationModel: Model<Registration>,
        @InjectModel('RegistrationAudit') private readonly registrationAuditModel: Model<RegistrationAudit>,
    ) {}

    async start(phoneNumber: string, loginMethod: 'facebook' | 'apple' | 'phone'): Promise<string> {
        const registrationId = crypto.randomUUID();
        const verificationId = loginMethod === 'phone' ? await this.verificationService.sendVerification(phoneNumber) : undefined;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        await this.registrationModel.create({
            registrationId,
            phoneNumber,
            verificationId,
            verificationStatus: 'pending',
            phoneVerified: false,
            stepsCompleted: ["start"],
            registrationData: {},
            loginMethod,
            createdAt: new Date(),
            expiresAt,
        });

        return registrationId;
    }

    async resendOtp(registrationId: string): Promise<void> {
        const registration = await this.registrationModel.findOne({
            registrationId,
            verificationStatus: 'pending',
            expiresAt: { $gte: new Date() },
        });
    
        if (!registration) {
            throw new Error('Invalid or expired registration ID');
        }
    
        if (registration.verificationStatus !== 'pending') {
            throw new Error('Cannot resend OTP for a non-pending verification');
        }
    
        const newVerificationId = await this.verificationService.sendVerification(registration.phoneNumber);
        registration.verificationId = newVerificationId;
        registration.updatedAt = new Date();
        await registration.save();
    }

    async verifyPhone(registrationId: string, code: string): Promise<void> {
        const registration = await this.registrationModel.findOne({ 
            registrationId,
            verificationStatus: 'pending',
            expiresAt: { $gte: new Date() },
        });

        if (!registration) {
            throw new Error('Invalid registration ID');
        }

        const isValid = await this.verificationService.validateVerification(registration.verificationId, code);

        if (!isValid) {
            throw new Error('Invalid verification code');
        }

        if (!registration.stepsCompleted.includes("confirm_phone")) {
            registration.stepsCompleted.push("confirm_phone");
        }

        registration.verificationStatus = 'verified';
        registration.phoneVerified = true;
        registration.updatedAt = new Date();  
        await registration.save();
    }

    async saveStep(registrationId: string, stepKey: string, stepData: Record<string, any>): Promise<{ message: string, nextStep?: string }> {
        const registration = await this.registrationModel.findOne({
            registrationId,
            verificationStatus: 'verified',
            expiresAt: { $gte: new Date() },
        });
    
        if (!registration) {
            throw new Error('Invalid registration ID.');
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

    async complete(registrationId: string): Promise<User> {
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
            phoneNumber: registrationData.phoneNumber,
            phoneVerified: registration.phoneVerified,
            name: typeof registrationData.name === 'object' ? registrationData.name.name : registrationData.name,
            dob: typeof registrationData.dob === 'object' ? registrationData.dob : null,
            gender: typeof registrationData.gender === 'object' ? registrationData.gender.gender : registrationData.gender,
            photos: photos,
            location: registrationData.location || null,
            showGender: registrationData.show_gender.showGender ?? true, 
            acceptPledge: registrationData.pledge.acceptPledge ?? false,
        };

        const user = await this.userService.create(createUserDto);
    
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
        isPhoneVerified: boolean;
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
          isPhoneVerified: registration.phoneVerified,
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
            const status = registration.phoneVerified ? 'abandoned' : 'unverified';
        
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
