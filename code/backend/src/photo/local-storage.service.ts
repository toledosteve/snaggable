import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class LocalStorageService implements StorageService {
    private uploadDir = join(process.cwd(), 'uploads');
    private allowedMimeTypes = ["image/jpeg", "image/png"];

    async upload(files: Express.Multer.File[], sessionId: string): Promise<string[]> {
        const sessionDir = join(this.uploadDir, sessionId);
        await fsPromises.mkdir(sessionDir, { recursive: true });

        const urls: string[] = [];

        for (const file of files) {
            // Validate the file
            const isValid = await this.validateFile(file);
            if (!isValid) {
              throw new Error(`Invalid file type: ${file.originalname}`);
            }
      
            // Generate a unique filename
            const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
            const uniqueFileName = `${randomUUID()}_${sanitizedFileName}`;
            const filePath = join(sessionDir, uniqueFileName);
      
            // Save the file to the local filesystem
            await fsPromises.writeFile(filePath, file.buffer);
      
            // Generate the URL for the uploaded file
            urls.push(`/uploads/${sessionId}/${uniqueFileName}`);
        }
      
          return urls;
    }

    async delete(filePath: string): Promise<void> {
        const fullPath = join(this.uploadDir, filePath.replace("/uploads/", ""));
        await fsPromises.unlink(fullPath);
    }

    async cleanupExpiredSessions(): Promise<void> {
        const files = await fsPromises.readdir(this.uploadDir);
        
        for (const file of files) {
            const filePath = join(this.uploadDir, file);
            const stats = await fsPromises.stat(filePath);
            
            const isExpired = Date.now() - stats.mtimeMs > 7 * 24 * 60 * 60 * 1000;
            if (isExpired) {
                await fsPromises.rm(filePath, { recursive: true, force: true });
            }
        }
    }

    private async validateFile(file: Express.Multer.File): Promise<boolean> {
        return this.allowedMimeTypes.includes(file.mimetype);
    }
}
