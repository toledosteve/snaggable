import { Module } from '@nestjs/common';
import { RegistrationService } from './registration/service/registration.service';
import { RegistrationController } from './registration/registration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationSchema, RegistrationAuditSchema } from './registration/schema/registration.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { PhotoModule } from 'src/shared/photo/photo.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserProfileController } from './profile/profile.controller';
import { UserProfileService } from './profile/user-profile.service';
import { UserProfileSchema } from './profile/schema/profile.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Registration', schema: RegistrationSchema },
      { name: 'RegistrationAudit', schema: RegistrationAuditSchema },
      { name: 'User', schema: UserSchema },
      { name: 'UserProfile', schema: UserProfileSchema },
    ]),
    PhotoModule.register('local'),
  ],
  exports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), MongooseModule.forFeature([{ name: 'UserProfile', schema: UserProfileSchema }])],
  controllers: [RegistrationController, UserController, UserProfileController],
  providers: [RegistrationService, UserService, UserProfileService]
})
export class UserModule {}
