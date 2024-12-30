import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendVerificationDto {
  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phoneNumber: string;
}

export class ValidateCodeDto {
  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  verificationId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
