import { IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID, Length } from "class-validator";

export class SocialAuthDto {
    @IsString()
    @IsEnum(["facebook", "apple", "google"], {
        message: "loginMethod must be one of the following values: facebook, apple, google",
    })
    loginMethod: "facebook" | "apple" | "google";

    @IsString()
    accessToken?: string;

    @IsString()
    @IsOptional()
    idToken?: string;
}

export class OTPAuthSendDto {
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string;
}

export class OTPAuthResendDto {
    @IsString()
    @IsUUID()
    verificationId: string;
}

export class OTPAuthVerifyDto {
    @IsString()
    @IsUUID()
    verificationId: string;

    @IsString()
    @Length(4)
    code: string;
}