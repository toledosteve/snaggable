import { Injectable, Inject } from '@nestjs/common';
import { IStorageProvider } from './providers/storage-provider.interface';

@Injectable()
export class PhotoService {
    constructor(
        @Inject('IStorageProvider') private readonly storageProvider: IStorageProvider
    ) {}

    async uploadPhoto(file: Express.Multer.File, registrationId: string): Promise<string> {
        const folder = `registration/${registrationId}`;
        return this.storageProvider.upload(file, folder);
    }

    async deletePhoto(filePath: string): Promise<void> {
        await this.storageProvider.delete(filePath);
    }

    async listPhotos(registrationId: string): Promise<string[]> {
        const folder = `registration/${registrationId}`;
        return this.storageProvider.list(folder);
    }
}
