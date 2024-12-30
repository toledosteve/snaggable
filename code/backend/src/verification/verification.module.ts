import { DynamicModule, Module } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SinchProvider } from './provider/sinch.provider';

@Module({})
export class VerificationModule {
  static register(providerType: 'sinch'): DynamicModule {
    const provider = providerType === 'sinch' ? SinchProvider : null;

    return {
      module: VerificationModule,
      providers: [
        {
          provide: 'IVerificationProvider',
          useClass: provider,
        },
        PhoneVerificationService,
      ],
      exports: [PhoneVerificationService],
    }
  }
}
