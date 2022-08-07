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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("../../services/upload/upload.service");
const id_dto_1 = require("./dto/id.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_guards_1 = require("../../auth/guards/jwt.guards");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const findAll_product_dto_1 = require("./dto/findAll-product.dto");
const createdBy_dto_1 = require("./dto/createdBy.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(adminId, req, files, createProductDto) {
        const { createdBy } = adminId;
        return this.productsService.create(req, createdBy, files, createProductDto);
    }
    findAll(findAllProductDto) {
        return this.productsService.findAll(findAllProductDto);
    }
    findOne(productId) {
        const { id } = productId;
        return this.productsService.findOne(id);
    }
    update(productId, req, files, updateProductDto) {
        const { id } = productId;
        return this.productsService.update(req, id, files, updateProductDto);
    }
    displayGallery(res, fileName) {
        return this.productsService.displayGallery(res, fileName);
    }
    remove(id) {
        return this.productsService.remove(+id);
    }
};
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('/addProduct/:createdBy'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'gallery', maxCount: 10 },
        { name: 'poster', maxCount: 1 }
    ], upload_service_1.multerOptions)),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createdBy_dto_1.CreatedByDto, Object, Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('/getAllProduct'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findAll_product_dto_1.FindAllProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('/getProduct/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'gallery', maxCount: 10 },
        { name: 'poster', maxCount: 1 }
    ], upload_service_1.multerOptions)),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Patch)('/updateProduct/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, Object, Object, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/file/:fileName'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "displayGallery", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map