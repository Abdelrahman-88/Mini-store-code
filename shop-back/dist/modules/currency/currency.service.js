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
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_service_1 = require("../../auth/service/auth/auth.service");
let CurrencyService = class CurrencyService {
    constructor(configService, currencyModel, authService) {
        this.configService = configService;
        this.currencyModel = currencyModel;
        this.authService = authService;
    }
    async create(req, createdBy, createCurrencyDto) {
        try {
            if (req.user.user._id.equals(createdBy)) {
                const product = new this.currencyModel(Object.assign({ createdBy }, createCurrencyDto));
                const data = await product.save();
                return { message: "Currency added successfully", data };
            }
            else {
                return new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to add currency');
        }
    }
    findAll() {
        return `This action returns all currency`;
    }
    async findOne() {
        try {
            const id = this.configService.get('CURRENCYID');
            const currency = await this.currencyModel.findOne({ _id: id });
            if (currency) {
                return { message: "done", currency };
            }
            else {
                return new common_1.NotFoundException('Faild to get currency');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get currency');
        }
    }
    async update(currencyId, updateCurrencyDto) {
        try {
            const currency = await this.currencyModel.findByIdAndUpdate({ _id: currencyId }, Object.assign({}, updateCurrencyDto), { new: true });
            if (currency) {
                return { message: "Currency updated successfully", currency };
            }
            else {
                return new common_1.NotFoundException('Invalid currency');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to add currency');
        }
    }
    remove(id) {
        return `This action removes a #${id} currency`;
    }
};
CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Currency')),
    __metadata("design:paramtypes", [config_1.ConfigService, mongoose_2.Model,
        auth_service_1.AuthService])
], CurrencyService);
exports.CurrencyService = CurrencyService;
//# sourceMappingURL=currency.service.js.map