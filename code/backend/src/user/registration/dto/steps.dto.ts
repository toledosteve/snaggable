import { IsNumber, IsString, Max, Min, IsIn, IsBoolean, IsArray, ArrayNotEmpty, IsNotEmpty, ValidateIf } from "class-validator";

export class StartDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['otp', 'facebook', 'google', 'apple'])
    loginMethod: string;

    @ValidateIf((obj) => obj.loginMethod === 'otp')
    @IsString()
    @IsNotEmpty()
    phoneNumber?: string;

    @ValidateIf((obj) => ['facebook', 'google', 'apple'].includes(obj.loginMethod))
    @IsString()
    @IsNotEmpty()
    email?: string;
}

export class NameDto {
    @IsString()
    name: string;
}

export class DobDto {
    @IsNumber()
    @Min(1, { message: "Day must be between 1 and 31" })
    @Max(31, { message: "Day must be between 1 and 31" })
    day: number;

    @IsString({ message: "Month must be a string" })
    month: string;

    @IsNumber()
    @Min(new Date().getFullYear() - 100, { message: "Year must be realistic" })
    @Max(new Date().getFullYear() - 18, { message: "You must be at least 18 years old" })
    year: number;
}

export class GenderDto {
    @IsString()
    @IsIn(['Uncle', 'Auntie', '2 Spirit'])
    gender: string;
}

export class ShowGenderDto {
    @IsBoolean()
    showGender: boolean;
}

export class PhotosDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    photos: string[];
}

export class LocationDto {
    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    accuracy: number;
}

export class PledgeDto {
    @IsBoolean()
    acceptPledge: boolean;
}