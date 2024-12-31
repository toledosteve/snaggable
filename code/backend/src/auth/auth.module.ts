import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { ClientAuthService } from './client-auth.service';
import { ClientSchema } from './schema/client.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
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
    ],
    controllers: [AuthController],
    providers: [AuthService, TokenBlacklistService, ClientAuthService, ClientService],
    exports: [PassportModule, JwtModule, TokenBlacklistService],
})
export class AuthModule {}
