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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_product_cart_dto_1 = require("./create-product-cart.dto");
class CreateCartDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, type: [create_product_cart_dto_1.CreateProductCartDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_transformer_1.Type)(() => create_product_cart_dto_1.CreateProductCartDto),
    __metadata("design:type", Array)
], CreateCartDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: ['usd', 'aed', 'jpy', 'eur'] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['usd', 'aed', 'jpy', 'eur']),
    __metadata("design:type", String)
], CreateCartDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: ['card', 'cash'] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['card', 'cash']),
    __metadata("design:type", String)
], CreateCartDto.prototype, "payment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.Matches)(/^(010|011|012|015)[0-9]{8}$/, {
        message: 'Contact number should be such as 010********',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "email", void 0);
exports.CreateCartDto = CreateCartDto;
//# sourceMappingURL=create-cart.dto.js.map