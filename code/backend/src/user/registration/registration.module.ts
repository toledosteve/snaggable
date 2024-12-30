import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './service/registration.service';
import { SinchService } from './service/sinch.service';
import { VerificationSchema } from './schema/verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Verification', schema: VerificationSchema },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, SinchService]
})
export class RegistrationModule {}
