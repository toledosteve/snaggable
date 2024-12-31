// user.dto.ts
import { IsString, IsBoolean, IsArray, IsOptional, IsObject, IsNumber, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  userId: string;

  @IsString()
  name: string;

  @IsObject()
  dob: { day: number; month: string; year: number };

  @IsString()
  gender: string;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsObject()
  @IsOptional()
  location?: { lat: number; lon: number };

  @IsBoolean()
  @IsOptional()
  showGender?: boolean;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  dob?: { day: number; month: string; year: number };

  @IsString()
  @IsOptional()
  gender?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsObject()
  @IsOptional()
  location?: { lat: number; lon: number };

  @IsBoolean()
  @IsOptional()
  showGender?: boolean;
}

export class UserResponseDto {
  @IsUUID()
  userId: string;

  @IsString()
  name: string;

  @IsObject()
  dob: { day: number; month: string; year: number };

  @IsString()
  gender: string;

  @IsArray()
  photos: string[];

  @IsObject()
  @IsOptional()
  location?: { lat: number; lon: number };

  @IsBoolean()
  showGender: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
