import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { LocalStorageService } from './local-storage.service';
import { STORAGE_SERVICE } from './storage.service';

@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: process.env.NODE_ENV === "production" ? LocalStorageService : LocalStorageService,
    }
  ],
  exports: [STORAGE_SERVICE],
  controllers: [PhotoController]
})
export class PhotoModule {}
