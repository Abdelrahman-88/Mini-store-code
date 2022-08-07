"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const gridfs_1 = require("multer-gridfs-storage/lib/gridfs");
const nanoid_1 = require("nanoid");
const config_1 = require("@nestjs/config");
require('dotenv').config();
let UploadService = class UploadService {
};
UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
exports.UploadService = UploadService;
const configService = new config_1.ConfigService;
const storage = new gridfs_1.GridFsStorage({
    url: configService.get("CONNECTION"),
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = (0, nanoid_1.nanoid)() + file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
    }
});
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp") {
        cb(null, true);
    }
    else {
        req.fileValidationError = "Forbidden extension only png/jpg/jpeg/webp available";
        return cb(null, false, req.fileValidationError);
    }
}
exports.multerOptions = {
    fileFilter,
    storage,
    limits: { fileSize: 1000 * 1000 }
};
//# sourceMappingURL=upload.service.js.map