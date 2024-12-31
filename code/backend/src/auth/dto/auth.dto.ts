import { IsString } from "class-validator";

export class AuthDto {
    @IsString()
    clientId: string;

    @IsString()
    clientSecret: string;
}


export class RefreshTokenDto {
    @IsString()
    refreshToken: string;
}