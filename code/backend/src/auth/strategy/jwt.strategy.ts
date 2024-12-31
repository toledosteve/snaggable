
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './../token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly blacklistService: TokenBlacklistService,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('auth.jwtSecret'),
        });
    }

    async validate(payload: any) {
        const token = payload.token;
        const isBlacklisted = await this.blacklistService.isRevoked(token);

        if (isBlacklisted) {
            throw new Error('Token is revoked.');
          }

        return { clientId: payload.clientId };
    }
}
