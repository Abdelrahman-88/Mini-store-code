"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_service_1 = require("../../auth/service/auth/auth.service");
const pages_service_1 = require("../../services/pages/pages.service");
const search_service_1 = require("../../services/search/search.service");
let ProductsService = class ProductsService {
    constructor(configService, productModel, pagesService, authService, searchService, connection) {
        this.configService = configService;
        this.productModel = productModel;
        this.pagesService = pagesService;
        this.authService = authService;
        this.searchService = searchService;
        this.connection = connection;
        this.fileModel = new mongoose_2.default.mongo.GridFSBucket(this.connection.db, {
            bucketName: "uploads"
        });
    }
    async create(req, createdBy, files, createProductDto) {
        try {
            if (req.fileValidationError) {
                return new common_1.BadRequestException(req.fileValidationError);
            }
            else {
                if (req.user.user._id.equals(createdBy)) {
                    if (files.gallery && files.poster) {
                        let gallery = [];
                        files.gallery.map((file) => { gallery.push(this.configService.get('PRODUCTSURL') + file.filename); });
                        const poster = this.configService.get('PRODUCTSURL') + files.poster[0].filename;
                        const product = new this.productModel(Object.assign({ createdBy, poster, gallery }, createProductDto));
                        const data = await product.save();
                        return { message: "Product added successfully", data };
                    }
                    else {
                        return new common_1.BadRequestException('Gallery and poster is required');
                    }
                }
                else {
                    return new common_1.UnauthorizedException('Unauthorized');
                }
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to add product');
        }
    }
    async findAll(findAllProductDto) {
        try {
            const { page, size, search, category } = findAllProductDto;
            const { skip, limit, currentPage } = this.pagesService.getPages(page, size);
            const products = await this.searchService.search(search, { category }, limit, skip, this.productModel, ['name'], "", "", "", -1);
            if (products.data.length) {
                return { message: "done", currentPage, limit, totalPages: products.totalPages, total: products.total, data: products.data };
            }
            else {
                return new common_1.NotFoundException("No products found");
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get all products');
        }
    }
    async findOne(productId) {
        try {
            const product = await this.productModel.findOne({ _id: productId });
            if (product) {
                return { message: "done", product };
            }
            else {
                return new common_1.NotFoundException('Invalid product');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get product');
        }
    }
    async update(req, productId, files, updateProductDto) {
        try {
            if (req.fileValidationError) {
                return new common_1.BadRequestException(req.fileValidationError);
            }
            else {
                const find = await this.productModel.findOne({ _id: productId });
                if (find) {
                    if (files.gallery && files.poster) {
                        let gallery = [];
                        files.gallery.map((file) => { gallery.push(this.configService.get('PRODUCTSURL') + file.filename); });
                        const poster = this.configService.get('PRODUCTSURL') + files.poster[0].filename;
                        const updated = await this.productModel.findOneAndUpdate({ _id: productId }, Object.assign({ gallery, poster }, updateProductDto), { new: true });
                        return { message: "Product updated successfully", updated };
                    }
                    else {
                        return new common_1.BadRequestException('Gallery and poster is required');
                    }
                }
                else {
                    return new common_1.NotFoundException('Invalid product');
                }
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to update product');
        }
    }
    async displayGallery(res, fileName) {
        try {
            const file = await this.productModel.findOne({ gallery: this.configService.get('PRODUCTSURL') + fileName });
            if (file) {
                let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
                downloadStream = downloadStream.pipe(res);
                downloadStream.on("data", function (data) {
                    return data;
                });
            }
            else {
                const poster = await this.productModel.findOne({ poster: this.configService.get('PRODUCTSURL') + fileName });
                if (poster) {
                    let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
                    downloadStream = downloadStream.pipe(res);
                    downloadStream.on("data", function (data) {
                        return data;
                    });
                }
                else {
                    let notFoundStream = this.fileModel.openDownloadStreamByName(this.configService.get('NOTFOUND'));
                    notFoundStream = notFoundStream.pipe(res);
                    notFoundStream.on("data", function (data) {
                        return data;
                    });
                }
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    remove(id) {
        return `This action removes a #${id} product`;
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Product')),
    __param(5, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [config_1.ConfigService, mongoose_2.Model,
        pages_service_1.PagesService, auth_service_1.AuthService, search_service_1.SearchService,
        mongoose_2.Connection])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map