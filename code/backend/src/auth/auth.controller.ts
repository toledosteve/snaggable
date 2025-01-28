import { Controller, Post, Body, UnauthorizedException, UseGuards, Req, BadRequestException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { OTPAuthResendDto, OTPAuthSendDto, OTPAuthVerifyDto, SocialAuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/client-auth.dto';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './guards/throttler/custom-throttler.guard';


@Controller('auth')
@UseGuards(AccessTokenGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('otp/send')
    @UseGuards(CustomThrottlerGuard)
    @Throttle({ otp: { limit: 1, ttl: 30 * 1000 } })
    @HttpCode(200)
    async sendOtp(@Body() authDto: OTPAuthSendDto, @Req() req: Request): Promise<{ message: string; verificationId: string; }> {
        try {
            const { verificationId } = await this.authService.sendOtp(authDto.phoneNumber, req.ip);
            return { message: 'OTP sent successfully', verificationId };
        } catch (error) {            
            throw new BadRequestException(error.message);
        }        
    }

    @Post("otp/resend")
    @UseGuards(CustomThrottlerGuard)
    @Throttle({ otp: { limit: 1, ttl: 30 * 1000 } })
    @HttpCode(200)
    async resendOtp(@Body() authDto: OTPAuthResendDto): Promise<{ message: string, verificationId: string }> {
        try {
            const { verificationId }  = await this.authService.resendOtp(authDto.verificationId);
            return { message: 'OTP resent successfully.', verificationId };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('otp/verify')
    @HttpCode(200)
    async verifyOtp(@Body() authDto: OTPAuthVerifyDto): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            return await this.authService.authenticateWithOtp(authDto.verificationId, authDto.code);
        } catch (error) {
            throw new BadRequestException(error.message);
        }        
    }
    
    @Post('social')
    @HttpCode(200)
    async authenticate(@Body() authDto: SocialAuthDto): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const { loginMethod, accessToken, idToken } = authDto;
      
            const result = await this.authService.authenticateWithSocial(
              loginMethod,
              accessToken,
              idToken
            );
      
            return result;
          } catch (error) {
            throw new BadRequestException(error.message);
          }
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
        try {
            const accessToken = await this.authService.refreshToken(refreshTokenDto.refreshToken);
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('revoke')
    @UseGuards(AccessTokenGuard)
    async revoke(@Req() req: any): Promise<{ message: string }> {
        const token = req.headers.authorization?.split(' ')[1];
        await this.authService.revokeToken(token);
        return { message: 'Token revoked successfully' };
    }
}