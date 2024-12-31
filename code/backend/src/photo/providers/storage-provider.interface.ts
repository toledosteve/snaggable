export interface IStorageProvider {
    upload(file: Express.Multer.File, folder: string): Promise<string>;
    delete(filePath: string): Promise<void>;
    list(folder: string): Promise<string[]>;
}