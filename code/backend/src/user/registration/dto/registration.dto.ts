import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @IsUUID(4)
  registrationId: string;
}

export class SaveStepDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  registrationId?: string;

  @IsString()
  step: string;

  @IsNotEmpty()
  data: any;
}
