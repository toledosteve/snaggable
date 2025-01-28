import { DynamicModule, Module } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SinchProvider } from './providers/sinch.provider';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class VerificationModule {
  static register(providerType: 'sinch'): DynamicModule {
    const provider = providerType === 'sinch' ? SinchProvider : null;

    return {
      module: VerificationModule,
      imports: [ConfigModule],
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
