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
exports.CreateCDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateCDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: ['$', 'د.إ', '¥', '€'] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['$', 'د.إ', '¥', '€']),
    __metadata("design:type", String)
], CreateCDto.prototype, "sign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: ['usd', 'aed', 'jpy', 'eur'] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['usd', 'aed', 'jpy', 'eur']),
    __metadata("design:type", String)
], CreateCDto.prototype, "code", void 0);
exports.CreateCDto = CreateCDto;
//# sourceMappingURL=create-c.dto.js.map