import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';
import { PhoneVerificationService } from "src/shared/verification/phone-verification.service";
import { OTPAuth } from "./schema/otp-auth.schema";
import { User } from '../user/schema/user.schema';
import { validateFacebookToken } from "./social/validators/facebook.validator";
import { validateGoogleToken } from "./social/validators/google.validator";
import { validateAppleToken } from "./social/validators/apple.validator";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly blacklistService: TokenBlacklistService,
        private readonly verificationService: PhoneVerificationService,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('OTPAuth') private readonly otpAuthModel: Model<OTPAuth>
    ) {}

    async sendOtp(phoneNumber: string, ipAddress: string): Promise<{ verificationId: string }> {
        const authRecord = await this.otpAuthModel.findOne({
            phoneNumber,
            step: 'send',
            status: 'pending',
            expiresAt: { $gte: new Date() },
        });

        if (authRecord) {
            throw new Error('An OTP is already pending for this phone number.');
        }

        try {
            const verificationId = await this.verificationService.sendVerification(phoneNumber);

            await this.otpAuthModel.create({
                verificationId,
                step: 'send',
                phoneNumber,
                ipAddress: ipAddress,
                status: 'pending',
                success: (verificationId) ? true : false,
            });

            return { verificationId };
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP');
        }
    }

    async resendOtp(verificationId: string): Promise<{ verificationId: string }> {
        const authRecord = await this.otpAuthModel.findOne({
            verificationId,
            step: 'send',
            status: 'pending',
            expiresAt: { $gte: new Date() },
        });
    
        if (!authRecord) {
            throw new Error('Invalid or expired registration ID');
        }
    
        if (authRecord.status !== 'pending') {
            throw new Error('Cannot resend OTP for a non-pending verification');
        }
    
        try {
            const newVerificationId = await this.verificationService.sendVerification(authRecord.phoneNumber);
            authRecord.verificationId = newVerificationId;
            authRecord.updatedAt = new Date();
            await authRecord.save();

            return { verificationId: newVerificationId };
        } catch (error) {
            console.error('Error resending OTP:', error);
            throw new Error('Failed to resend OTP');
        }
    }

    async authenticateWithOtp(verificationId: string, code: string): Promise<{ accessToken: string; refreshToken: string }> {
        const authRecord = await this.otpAuthModel.findOne({
            verificationId,
            step: 'send',
            status: 'pending',
            expiresAt: { $gte: new Date() },
        });

        if (!authRecord) {
            throw new Error('Invalid or expired OTP request');
        }

        try { 
            const isValid = await this.verificationService.validateVerification(verificationId, code);
            authRecord.status = isValid ? 'verified' : 'failed';
            authRecord.success = isValid;
            authRecord.error = isValid ? null : 'Invalid verification code';
            await authRecord.save();
            if (!isValid) {
                throw new Error('Invalid verification code');
            }
        } catch (error) {
            console.error('Error authenticating with OTP:', error);
            throw new Error('Failed to authenticate with OTP');
        }

        const user = await this.userModel.findOne({ phoneNumber: authRecord.phoneNumber });

        if (!user) {
            throw new Error('No user associated with this phone number');
        }

        const tokens = await this.generateAccessToken(user.userId);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    async authenticateWithSocial(loginMethod: string, accessToken: string, idToken: string) {
        let userData;
    
        switch (loginMethod) {
          case 'facebook':
            userData = await validateFacebookToken(accessToken);
            break;
          case 'google':
            userData = await validateGoogleToken(idToken);
            break;
          case 'apple':
            userData = await validateAppleToken(idToken);
            break;
          default:
            throw new Error('Unsupported login method');
        }
    
        console.log('User data:', userData);
        const { id, email, name } = userData;
        let user = await this.userModel.findOne({ email: email });

        if (!user) {
            throw new Error('No user associated with this email');
        }

        const tokens = await this.generateAccessToken(user.userId);
    
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
      }

    async generateAccessToken(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { sub: userId };

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('auth.refreshTokenSecret'),
            expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn'),
        });

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('auth.jwtSecret'),
            expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
        });

        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<string> {
        const isBlacklisted = await this.blacklistService.isRevoked(refreshToken);

        if (isBlacklisted) {
            throw new Error('Refresh token is revoked.');
        }

        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('auth.refreshTokenSecret'),
            });

            return this.jwtService.sign({ clientId: payload.clientId }, {
                secret: this.configService.get<string>('auth..jwtSecret'),
                expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
            });
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async revokeToken(token: string): Promise<void> {
        const decoded = this.jwtService.decode(token) as any;
        const expiration = decoded?.exp - Math.floor(Date.now() / 1000);
        if (expiration > 0) {
            await this.blacklistService.add(token, expiration);
        }
    }
}