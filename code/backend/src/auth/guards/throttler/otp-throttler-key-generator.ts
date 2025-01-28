import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class OTPThrottlerKeyGenerator {
  generateKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const method = context.getHandler().name;
    const phoneNumber = request.body?.phoneNumber || 'unknown-phone';
    const ipAddress = request.ip || 'unknown-ip';
    const key = `otp:${method}:${phoneNumber}:${ipAddress}`;
    console.log('Generated Key:', key);

    if (!key) {
      throw new Error('Generated key is invalid');
    }

    return key;
  }
}
