import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsNotEmptyObject, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Gender {
  AUNTIE = 'auntie',
  UNCLE = 'uncle',
  TWO_SPIRIT = '2-spirit',
}

class DateDto {
  @IsNumber()
  day: number;

  @IsString()
  month: string;

  @IsNumber()
  year: number;
}

class VisibilityDto {
  @IsString()
  value: string;

  @IsString()
  visibility: 'public' | 'private';
}

class LocationDto {
  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lon?: number;
}

class VitalsDto {
  @ValidateNested()
  @Type(() => DateDto)
  dob: DateDto;

  @IsNumber()
  height: number;

  @IsString()
  @IsOptional()
  exercise?: string;

  @ValidateNested()
  @Type(() => VisibilityDto)
  pets?: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  children?: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  familyPlans?: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  zodiac?: VisibilityDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location: LocationDto;
}

class CulturalInfoDto {
  @IsString()
  @IsOptional()
  tribalStatus?: string;

  @IsString()
  @IsOptional()
  nameOfTribe?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  traditionalSkills?: string[];

  @ValidateNested()
  @Type(() => VisibilityDto)
  language: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  clan: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  advocacy: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  beliefs: VisibilityDto;
}

class VirtuesDto {
  @ValidateNested()
  @Type(() => VisibilityDto)
  jobTitle: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  education: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  politics: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  intentions: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  relationshipType: VisibilityDto;
}

class VicesDto {
  @ValidateNested()
  @Type(() => VisibilityDto)
  smoking: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  drinking: VisibilityDto;

  @ValidateNested()
  @Type(() => VisibilityDto)
  marijuana: VisibilityDto;
}

class IdentityDto {
  @IsString()
  @IsEnum(Gender, {
    message: `gender must be one of the following values: ${Object.values(Gender).join(', ')}`,
  })
  gender: Gender;

  @IsBoolean()
  showGender: boolean;

  @IsArray()
  @IsString({ each: true })
  interestedIn: string[];
}

class PromptDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class CreateUserProfileDto {
  @IsString()
  @IsOptional()
  aboutMe?: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => VitalsDto)
  vitals: VitalsDto;

  @ValidateNested()
  @Type(() => CulturalInfoDto)
  culturalInfo?: CulturalInfoDto;

  @ValidateNested()
  @Type(() => VirtuesDto)
  virtues?: VirtuesDto;

  @ValidateNested()
  @Type(() => VicesDto)
  vices?: VicesDto;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => IdentityDto)
  identity: IdentityDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @ValidateNested({ each: true })
  @Type(() => PromptDto)
  @IsOptional()
  prompts?: PromptDto[];
}

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}