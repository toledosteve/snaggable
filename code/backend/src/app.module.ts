import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoModule } from './shared/photo/photo.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './shared/health/health.module';
import configuration from './shared/config/configuration';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { OTPThrottlerKeyGenerator } from './auth/guards/throttler/otp-throttler-key-generator';
import { HttpModule } from '@nestjs/axios';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    UserModule,
    PhotoModule,
    AuthModule,
    HealthModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('logging.logLevel'),
          transport: 
          configService.get<string>('env') !== 'production' ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: true,
              ignore: 'pid,hostname',
            },
          }
          : undefined,
          customProps: (req, res) => ({
            context: 'HTTP',
            requestId: req.headers['x-request-id'],
          }),
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ) => ({
        throttlers: [
          {
            name: 'otp',
            ttl: configService.get<number>('throttle.ttl'),
            limit: configService.get<number>('throttle.limit'),
            blockDuration: 120,
            getTracker: (req, context) => {
              const keyGenerator = new OTPThrottlerKeyGenerator();
              const tracker = keyGenerator.generateKey(context);
              return tracker;
            }
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(configService.get<string>('redis.host')),
        ),
      }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
