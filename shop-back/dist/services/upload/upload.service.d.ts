import { GridFsStorage } from 'multer-gridfs-storage/lib/gridfs';
export declare class UploadService {
}
declare function fileFilter(req: any, file: any, cb: any): any;
export declare const multerOptions: {
    fileFilter: typeof fileFilter;
    storage: GridFsStorage;
    limits: {
        fileSize: number;
    };
};
export {};
