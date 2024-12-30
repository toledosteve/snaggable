import { IsNotEmpty, IsPhoneNumber, IsString, IsIn } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phoneNumber: string;
}

export class VerifyPhoneDto {
  @IsNotEmpty()
  @IsString()
  registrationId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
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
