import { Injectable } from '@nestjs/common';
import { Verification, VerificationService } from '@sinch/sdk-core';
import { IVerificationProvider } from '../verification-provider.interface';

@Injectable()
export class SinchProvider implements IVerificationProvider{
  private verificationService: VerificationService;

  constructor() {
    const credentials = {
      applicationKey: process.env.SINCH_APP_KEY || 'e72024ad-18c0-4f03-8e9f-9ae27fe483bd',
      applicationSecret: process.env.SINCH_APP_SECRET || '+3GZrskdu0yZecjrsRTIoQ==',
    };

    if (!credentials.applicationKey || !credentials.applicationSecret) {
      throw new Error('Sinch application key or secret is missing.');
    }

    this.verificationService = new VerificationService(credentials);
  }

  async sendVerification(phoneNumber: string): Promise<string> {
    const requestData = Verification.startVerificationHelper.buildSmsRequest(phoneNumber);

    try {
      const response = await this.verificationService.verifications.startSms(requestData);

      if (!response.id) {
        throw new Error('Sinch verification ID is undefined.');
      }

      return response.id;
    } catch (error) {
      throw new Error(`Failed to start SMS verification: ${error.message}`);
    }
  }

  async validateVerification(verificationId: string, code: string): Promise<boolean> {
    const requestData = Verification.reportVerificationByIdHelper.buildSmsRequest(verificationId, code);

    try {
      const response = await this.verificationService.verifications.reportSmsById(requestData);

      if (!response.status) {
        throw new Error('Verification status is undefined.');
      }

      return response.status === 'SUCCESSFUL';
    } catch (error) {
      throw new Error(`Failed to verify SMS code: ${error.message}`);
    }
  }
}
