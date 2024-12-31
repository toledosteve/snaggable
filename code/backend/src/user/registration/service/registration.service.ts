import { Injectable, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationAudit } from '../schema/registration.schema';
import { PhoneVerificationService } from 'src/verification/phone-verification.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/user.schema';
import { stepsRegistry, stepsOrder } from '../config/steps.config';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { PhotoService } from 'src/photo/photo-upload.service';

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
            stepsCompleted: [],
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
            throw new Error('Invalid registration ID');
        }

        if (registration.verificationStatus !== 'pending') {
            throw new Error('Cannot resend OTP for a non-pending verification');
        }

        const newVerificationId = await this.verificationService.sendVerification(registration.phoneNumber);
        registration.verificationId = newVerificationId;
        registration.verificationStatus = 'pending';
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
    
        const requiredSteps = Object.keys(stepsRegistry);
        const missingSteps = requiredSteps.filter(step => !registration.stepsCompleted.includes(step));
    
        if (missingSteps.length > 0) {
            throw new Error(`Missing steps: ${missingSteps.join(', ')}`);
        }

        const registrationData = Object.fromEntries(registration.registrationData);

        if (!registrationData.pledge || registrationData.pledge.acceptPledge !== true) {
            throw new Error('Pledge must be accepted before completing registration.');
        }

        const createUserDto: CreateUserDto = {
            userId: registrationId,
            phoneNumber: registrationData.phoneNumber,
            phoneVerified: registration.phoneVerified,
            name: typeof registrationData.name === 'object' ? registrationData.name.name : registrationData.name,
            dob: typeof registrationData.dob === 'object' ? registrationData.dob : null,
            gender: typeof registrationData.gender === 'object' ? registrationData.gender.gender : registrationData.gender,
            photos: registrationData.photos || [],
            location: registrationData.location || null,
            showGender: registrationData.showGender.showGender ?? true, 
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

        registration.registrationData.set('photos', uploadedUrls);
        if (!registration.stepsCompleted.includes('photos')) {
            registration.stepsCompleted.push('photos');
          }
        registration.updatedAt = new Date();
        await registration.save();

        return { urls: uploadedUrls };
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
