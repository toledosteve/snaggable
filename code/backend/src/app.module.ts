import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoModule } from './photo/photo.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
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
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
