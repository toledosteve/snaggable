import { Module } from '@nestjs/common';
import { VerificationModule } from '../verification/verification.module';
import { RegistrationService } from './registration/service/registration.service';
import { RegistrationController } from './registration/registration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationSchema, RegistrationAuditSchema } from './registration/schema/registration.schema';

@Module({
  imports: [
    VerificationModule.register('sinch'),
    MongooseModule.forFeature([
      { name: 'Registration', schema: RegistrationSchema },
      { name: 'RegistrationAudit', schema: RegistrationAuditSchema },
    ])
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService]
})
export class UserModule {}
