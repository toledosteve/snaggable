import { IsNotEmpty, IsPhoneNumber, IsString, IsEnum, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phoneNumber: string;

  @IsEnum(['facebook', 'apple', 'phone'], { message: 'Invalid login method' })
  loginMethod: 'facebook' | 'apple' | 'phone';
}

export class VerifyPhoneDto {
  @IsNotEmpty()
  @IsString()
  registrationId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class CompleteRegistrationDto {
  @IsString()
  @IsUUID(4)
  registrationId: string;
}

export class SaveStepDto {
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @IsString()
  step: string;

  @IsNotEmpty()
  data: any;
}
