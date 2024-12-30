export interface StorageService {
    upload(file: Express.Multer.File[], sessionId: string): Promise<string[]>;
    delete(filePath: string): Promise<void>;
    cleanupExpiredSessions(): Promise<void>;
}

export const STORAGE_SERVICE = "STORAGE_SERVICE";