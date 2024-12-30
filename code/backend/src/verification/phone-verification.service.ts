import { Injectable, Inject } from '@nestjs/common';
import { IVerificationProvider } from './verification-provider.interface';

@Injectable()
export class PhoneVerificationService {
    constructor(
        @Inject('IVerificationProvider') private readonly provider: IVerificationProvider
    ) {}

    async sendVerification(phoneNumber: string): Promise<string> {
        try {
            const verificationId = await this.provider.sendVerification(phoneNumber);    
            return verificationId;
        } catch (error) {
            throw new Error("Failed to send verification code.");
        }
    }

    async validateVerification(verificationId: string, code: string): Promise<boolean> {
        try {
          return await this.provider.validateVerification(verificationId, code);
        } catch (error) {
          throw new Error(`Failed to validate verification: ${error.message}`);
        }
      }
}
