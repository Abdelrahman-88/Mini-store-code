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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const jwt_guards_1 = require("../../auth/guards/jwt.guards");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const cart_service_1 = require("./cart.service");
const create_cart_dto_1 = require("./dto/create-cart.dto");
const createdBy_dto_1 = require("./dto/createdBy.dto");
const findAll_cart_dto_1 = require("./dto/findAll-cart.dto");
const id_dto_1 = require("./dto/id.dto");
const update_cart_dto_1 = require("./dto/update-cart.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    create(req, userId, createCartDto) {
        const { createdBy } = userId;
        return this.cartService.create(req, createdBy, createCartDto);
    }
    findAll(findAllCartDto) {
        return this.cartService.findAll(findAllCartDto);
    }
    findAllUserCarts(req, userId, findAllCartDto) {
        const { createdBy } = userId;
        return this.cartService.findAllUserCarts(req, createdBy, findAllCartDto);
    }
    findOne(req, cartId) {
        const { id } = cartId;
        return this.cartService.findOne(req, id);
    }
    update(cartId, updateCartDto) {
        const { id } = cartId;
        return this.cartService.update(id, updateCartDto);
    }
    remove(id) {
        return this.cartService.remove(+id);
    }
};
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('/addCart/:createdBy'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createdBy_dto_1.CreatedByDto, create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('/getAllCart'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findAll_cart_dto_1.FindAllCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('/getAllUserCart/:createdBy'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createdBy_dto_1.CreatedByDto, findAll_cart_dto_1.FindAllCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "findAllUserCarts", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER, user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('/getCart/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.idDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Patch)('/validateCart/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, update_cart_dto_1.UpdateCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "update", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "remove", null);
CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map