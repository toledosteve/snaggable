import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly blacklistService: TokenBlacklistService
    ) {}

    async generateAccessToken(clientId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { clientId };

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