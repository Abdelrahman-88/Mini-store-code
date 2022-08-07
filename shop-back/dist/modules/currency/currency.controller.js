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
exports.CurrencyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const jwt_guards_1 = require("../../auth/guards/jwt.guards");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const currency_service_1 = require("./currency.service");
const create_currency_dto_1 = require("./dto/create-currency.dto");
const createdBy_dto_1 = require("./dto/createdBy.dto");
const id_dto_1 = require("./dto/id.dto");
const update_currency_dto_1 = require("./dto/update-currency.dto");
let CurrencyController = class CurrencyController {
    constructor(currencyService) {
        this.currencyService = currencyService;
    }
    create(adminId, req, createCurrencyDto) {
        const { createdBy } = adminId;
        return this.currencyService.create(req, createdBy, createCurrencyDto);
    }
    findAll() {
        return this.currencyService.findAll();
    }
    findOne() {
        return this.currencyService.findOne();
    }
    update(currencyId, updateCurrencyDto) {
        const { id } = currencyId;
        return this.currencyService.update(id, updateCurrencyDto);
    }
    remove(id) {
        return this.currencyService.remove(+id);
    }
};
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('/addCurrency/:createdBy'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createdBy_dto_1.CreatedByDto, Object, create_currency_dto_1.CreateCurrencyDto]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/getCurrency'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Patch)('/updateCurrency/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, update_currency_dto_1.UpdateCurrencyDto]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "update", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CurrencyController.prototype, "remove", null);
CurrencyController = __decorate([
    (0, swagger_1.ApiTags)('Currency'),
    (0, common_1.Controller)('currency'),
    __metadata("design:paramtypes", [currency_service_1.CurrencyService])
], CurrencyController);
exports.CurrencyController = CurrencyController;
//# sourceMappingURL=currency.controller.js.map