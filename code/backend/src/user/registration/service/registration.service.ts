import { Injectable, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationAudit } from '../schema/registration.schema';
import { PhoneVerificationService } from 'src/verification/phone-verification.service';
import { stepsRegistry } from '../config/steps.config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly verificationService: PhoneVerificationService,
        @InjectModel('Registration') private readonly registrationModel: Model<Registration>,
        @InjectModel('RegistrationAudit') private readonly registrationAuditModel: Model<RegistrationAudit>,
    ) {}

    async start(phoneNumber: string): Promise<string> {
        const registrationId = crypto.randomUUID();
        const verificationId = await this.verificationService.sendVerification(phoneNumber);
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        await this.registrationModel.create({
            registrationId,
            phoneNumber,
            verificationId,
            verificationStatus: 'pending',
            phoneVerified: false,
            stepsCompleted: [],
            registrationData: {},
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
            throw new Error('Invalid registration ID');
        }

        if (registration.stepsCompleted.includes(stepKey)) {
            throw new Error(`Step "${stepKey}" has already been completed.`);
        }

        const StepDto = stepsRegistry[stepKey];
        if (!StepDto) {
            throw new Error(`Step "${stepKey}" is not a valid registration step.`);
        }

        const validatedData = plainToInstance(StepDto, stepData);
        console.log('Transformed Data:', validatedData);
        try {
            await new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                exceptionFactory: (errors) => {
                    const formattedErrors = errors.map((err) => ({
                        field: err.property,
                        errors: Object.values(err.constraints || {}),
                    }));
                    return new Error(
                        `Validation failed for step "${stepKey}": ${JSON.stringify(
                            formattedErrors
                        )}`
                    );
                },
            }).transform(validatedData, { type: 'body' });
        } catch (error) {
            throw new Error(error.message);
        }

        registration.stepsCompleted.push(stepKey);
        registration.registrationData[stepKey] = stepData;
        registration.updatedAt = new Date();
        await registration.save();

        const nextStep = this.getNextStep(stepKey);
        return {
            message: 'Step saved successfully.',
            nextStep,
        }
    }

    async complete(registrationId: string): Promise<void> {
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

        await this.registrationAuditModel.create({
            registrationId,
            status: 'completed',
            stepsCompleted: registration.stepsCompleted,
            createdAt: registration.createdAt,
            completedAt: new Date(),
        });

        await this.registrationModel.deleteOne({ registrationId });
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

    private getNextStep(currentStep: string): string | null {
        const steps = Object.keys(stepsRegistry);
        const currentIndex = steps.indexOf(currentStep);
      
        if (currentIndex === -1) {
          throw new Error(`Invalid current step: ${currentStep}`);
        }
      
        const nextIndex = currentIndex + 1;
        return steps[nextIndex] || null; 
    }
}
