import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SinchService } from './sinch.service';
import { Verification } from './../schema/verification.schema';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectModel('Verification') private readonly verificationModel: Model<Verification>,
        private readonly sinchService: SinchService
    ) {}

    async sendVerification(phoneNumber: string): Promise<string> {
        try {
            // Mark all existing 'pending' records for this phone number as 'invalid'
            await this.verificationModel.updateMany(
                { phoneNumber, status: 'pending' },
                { $set: { status: 'invalid', updatedAt: new Date() } }
            );
    
            // Start a new SMS verification
            const verificationId = await this.sinchService.startSmsVerification(phoneNumber);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
            // Create a new verification record
            const verification = new this.verificationModel({
                phoneNumber,
                verificationId,
                status: 'pending',
                expiresAt,
            });
    
            // Save the new record
            await verification.save();
    
            return verificationId;
        } catch (error) {
            console.error("Error in sendVerification:", error);
            throw new Error("Failed to send verification code.");
        }
    }
    

    async validateCode(phoneNumber: string, verificationId: string, code: string): Promise<void> {
        const verification = await this.verificationModel.findOne({ phoneNumber, verificationId });

        if (!verification) {
            throw new HttpException(
            'Verification record not found for the provided phone number and ID.',
            HttpStatus.NOT_FOUND,
            );
        }

        if (verification.status !== 'pending') {
            throw new HttpException(
            'Verification code has already been used or is no longer valid.',
            HttpStatus.BAD_REQUEST,
            );
        }

        if (new Date() > verification.expiresAt) {
            verification.status = 'expired';
            await verification.save(); // Persist the expired status
            throw new HttpException('Verification code has expired. Please request a new one.', HttpStatus.BAD_REQUEST);
        }

        try {
            const status = await this.sinchService.verifySmsCode(verificationId, code);

            if (status !== 'SUCCESSFUL') {
            throw new Error('Verification code is invalid or not recognized.');
            }
        } catch (error) {
            throw new HttpException(
            'Invalid verification code. Please check the code and try again.',
            HttpStatus.BAD_REQUEST,
            );
        }

        verification.status = 'verified';
        await verification.save();
    }
}
