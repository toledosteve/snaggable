import { Controller, Post, UseInterceptors, UploadedFiles, Inject, BadRequestException } from '@nestjs/common';
import { STORAGE_SERVICE, StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class PhotoController {
    constructor(@Inject(STORAGE_SERVICE) private readonly storageService: StorageService) {}

    @Post("upload")
  @UseInterceptors(FilesInterceptor("files", 6, { limits: { fileSize: 5 * 1024 * 1024 }})) 
  async uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ urls: string[] }> {
    try {
      const sessionId = "test-session"; // Replace with actual session logic

      // Delegate validation and upload logic to the service
      const urls = await this.storageService.upload(files, sessionId);

      return { urls };
    } catch (error) {
      throw new BadRequestException(error.message); // Return an HTTP 400 error to the client
    }
  }
}
