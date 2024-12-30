import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Verification, VerificationService } from '@sinch/sdk-core';

@Injectable()
export class SinchService {
  private verificationService: VerificationService;

  constructor() {
    const credentials = {
      applicationKey: process.env.SINCH_APP_KEY || 'e72024ad-18c0-4f03-8e9f-9ae27fe483bd',
      applicationSecret: process.env.SINCH_APP_SECRET || '+3GZrskdu0yZecjrsRTIoQ==',
    };

    if (!credentials.applicationKey || !credentials.applicationSecret) {
      throw new Error('Sinch application key or secret is missing in environment variables.');
    }

    this.verificationService = new VerificationService(credentials);
  }

  async startSmsVerification(phoneNumber: string): Promise<string> {
    const requestData = Verification.startVerificationHelper.buildSmsRequest(phoneNumber);

    try {
      const response = await this.verificationService.verifications.startSms(requestData);
      if (!response.id) {
        throw new Error('Verification ID is undefined.');
      }
      return response.id;
    } catch (error) {
      throw new HttpException(
        `Failed to start SMS verification: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifySmsCode(verificationId: string, code: string): Promise<string> {
    const requestData = Verification.reportVerificationByIdHelper.buildSmsRequest(verificationId, code);

    try {
      const response = await this.verificationService.verifications.reportSmsById(requestData);
      return response.status;
    } catch (error) {
      throw new HttpException(
        `Invalid verification code or ID: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
