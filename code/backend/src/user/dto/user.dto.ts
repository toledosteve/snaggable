import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEmail, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class PhoneNumberDto {
  @IsString()
  value: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}

class EmailDto {
  @IsEmail()
  value: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}

class LinkedAccountDto {
  @IsString()
  id: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => PhoneNumberDto)
  phoneNumber: PhoneNumberDto;

  @ValidateNested()
  @Type(() => EmailDto)
  email: EmailDto;

  @ValidateNested()
  @Type(() => LinkedAccountDto)
  @IsOptional()
  google?: LinkedAccountDto;

  @ValidateNested()
  @Type(() => LinkedAccountDto)
  @IsOptional()
  apple?: LinkedAccountDto;

  @ValidateNested()
  @Type(() => LinkedAccountDto)
  @IsOptional()
  facebook?: LinkedAccountDto;

  @IsBoolean()
  @IsOptional()
  acceptPledge?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UserResponseDto extends PartialType(CreateUserDto) {}