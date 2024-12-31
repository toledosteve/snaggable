import { DynamicModule, Module } from '@nestjs/common';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { PhotoService } from './photo-upload.service';

@Module({})
export class PhotoModule {
  static register(providerType: 'aws' | 'local'): DynamicModule {
    const provider = providerType === 'aws' ? LocalStorageProvider : LocalStorageProvider;

    return {
      module: PhotoModule,
      providers: [
        {
          provide: 'IStorageProvider',
          useClass: provider,
        },
        PhotoService,
      ],
      exports: [PhotoService],
    }
  }
}
