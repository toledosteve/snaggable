import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { ClientAuthService } from './client-auth.service';
import { ClientSchema } from './schema/client.schema';
import { OTPAuthSchema } from './schema/otp-auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { VerificationModule } from 'src/shared/verification/verification.module';
import { forwardRef } from '@nestjs/common';
import { ClientAuthController } from './client-auth.controller';

@Module({
    imports: [
        VerificationModule.register('sinch'),
        MongooseModule.forFeature([
            { name: 'Client', schema: ClientSchema },
            { name: 'OTPAuth', schema: OTPAuthSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('auth.jwtSecret'),
                signOptions: {
                    expiresIn: configService.get<string>('auth.jwtExpiresIn'),
                },
            }),
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'single',
                url: configService.get<string>('redis.host'),
            }),
        }),
        forwardRef(() => UserModule)
    ],
    controllers: [AuthController, ClientAuthController],
    providers: [
        AuthService, 
        TokenBlacklistService, 
        ClientAuthService, 
        ClientService
    ],
    exports: [PassportModule, JwtModule, TokenBlacklistService],
})
export class AuthModule {}