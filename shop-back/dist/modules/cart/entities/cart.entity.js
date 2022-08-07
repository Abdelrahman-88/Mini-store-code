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
exports.CartSchema = exports.Cart = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../users/entities/user.entity");
let Cart = class Cart extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_entity_1.User)
], Cart.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true, type: [{ quantity: { type: Number, required: true }, total: { type: Number }, product: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Product', required: true }, _id: false }]
    }),
    __metadata("design:type", Array)
], Cart.prototype, "products", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Cart.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['usd', 'aed', 'jpy', 'eur'] }),
    __metadata("design:type", String)
], Cart.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['open', 'pending', 'closed'], default: 'open' }),
    __metadata("design:type", String)
], Cart.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Cart.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Cart.prototype, "contactNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['card', 'cash'] }),
    __metadata("design:type", String)
], Cart.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, lowercase: true }),
    __metadata("design:type", String)
], Cart.prototype, "email", void 0);
Cart = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Cart);
exports.Cart = Cart;
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
//# sourceMappingURL=cart.entity.js.map