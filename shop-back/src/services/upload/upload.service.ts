import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { GridFsStorage } from 'multer-gridfs-storage/lib/gridfs';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
require('dotenv').config()

@Injectable()

export class UploadService  {
    
}
const configService = new ConfigService
const storage = new GridFsStorage({
    url: configService.get("CONNECTION"),
    file: (req, file) => {
        
        return new Promise((resolve, reject) => {
            const filename = nanoid() + file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
        });
    }
});


  function fileFilter(req:any, file:any, cb:any) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp") {

        cb(null, true)
    } else {
        req.fileValidationError = "Forbidden extension only png/jpg/jpeg/webp available";

        return cb(null, false, req.fileValidationError)
    }
}

export const multerOptions = {
    fileFilter,
    storage,
    limits: { fileSize: 1000 * 1000 }
}
