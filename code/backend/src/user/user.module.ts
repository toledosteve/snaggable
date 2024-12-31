import { Module } from '@nestjs/common';
import { VerificationModule } from '../verification/verification.module';
import { RegistrationService } from './registration/service/registration.service';
import { RegistrationController } from './registration/registration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationSchema, RegistrationAuditSchema } from './registration/schema/registration.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [
    VerificationModule.register('sinch'),
    MongooseModule.forFeature([
      { name: 'Registration', schema: RegistrationSchema },
      { name: 'RegistrationAudit', schema: RegistrationAuditSchema },
      { name: 'User', schema: UserSchema }
    ]),
    PhotoModule.register('local'),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, UserService]
})
export class UserModule {}
