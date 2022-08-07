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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_service_1 = require("../../auth/service/auth/auth.service");
const pages_service_1 = require("../../services/pages/pages.service");
const search_service_1 = require("../../services/search/search.service");
const stripe_1 = require("stripe");
let CartService = class CartService {
    constructor(configService, cartModel, pagesService, authService, searchService, productModel, currencyModel) {
        this.configService = configService;
        this.cartModel = cartModel;
        this.pagesService = pagesService;
        this.authService = authService;
        this.searchService = searchService;
        this.productModel = productModel;
        this.currencyModel = currencyModel;
        this.stripe = new stripe_1.default(process.env.SECRET_kEY_API, {
            apiVersion: '2020-08-27',
        });
    }
    async create(req, createdBy, createCartDto) {
        try {
            if (req.user.user._id.equals(createdBy)) {
                let error = false;
                let { products, currency, email, payment } = createCartDto, rest = __rest(createCartDto, ["products", "currency", "email", "payment"]);
                email = email.toLocaleLowerCase();
                const id = this.configService.get('CURRENCYID');
                const newCurrency = await this.currencyModel.findOne({ _id: id });
                const rate = newCurrency[currency].rate;
                let newProducts = [];
                let totalPrice = 0;
                const promises = products.map(async (product) => {
                    const valid = await this.productModel.findOne({ _id: product.product });
                    if (valid) {
                        product['total'] = (valid.price * product.quantity) * rate;
                        totalPrice += product.total;
                        newProducts.push(product);
                    }
                    else {
                        error = true;
                    }
                });
                await Promise.all(promises);
                if (error) {
                    return new common_1.NotFoundException('Invalid product');
                }
                else {
                    if (payment == 'card') {
                        const confirm = await this.payment(totalPrice, currency, email);
                        if (confirm) {
                            const newCart = new this.cartModel(Object.assign({ createdBy, currency, products: newProducts, totalPrice, email, payment }, rest));
                            const cart = await newCart.save();
                            return { message: "Cart added successfully", cart };
                        }
                        else {
                            return new common_1.InternalServerErrorException('Faild to add cart');
                        }
                    }
                    else {
                        const newCart = new this.cartModel(Object.assign({ createdBy, currency, products: newProducts, totalPrice, email, payment }, rest));
                        const cart = await newCart.save();
                        return { message: "Cart added successfully", cart };
                    }
                }
            }
            else {
                return new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to add cart');
        }
    }
    async payment(total, currency, email) {
        try {
            let amount;
            if (currency == 'jpy') {
                amount = (total).toFixed(0);
            }
            else {
                amount = total * 100;
            }
            const charged = await this.stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                payment_method_types: ['card'],
                receipt_email: email
            });
            const paymentConfirm = await this.stripe.paymentIntents.confirm(charged.id, { payment_method: "pm_card_visa" });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findAll(findAllCartDto) {
        try {
            const { page, size, status } = findAllCartDto;
            const { skip, limit, currentPage } = this.pagesService.getPages(page, size);
            const carts = await this.searchService.search('', { status }, limit, skip, this.cartModel, [], "", "", "", -1);
            if (carts.data.length) {
                return { message: "done", currentPage, limit, totalPages: carts.totalPages, total: carts.total, data: carts.data };
            }
            else {
                return new common_1.NotFoundException("No carts found");
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get all carts');
        }
    }
    async findAllUserCarts(req, createdBy, findAllCartDto) {
        try {
            if (req.user.user._id.equals(createdBy)) {
                const { page, size, status, sort } = findAllCartDto;
                const { skip, limit, currentPage } = this.pagesService.getPages(page, size);
                const carts = await this.searchService.search('', { createdBy, status }, limit, skip, this.cartModel, [], "", "", "", sort);
                if (carts.data.length) {
                    return { message: "done", currentPage, limit, totalPages: carts.totalPages, total: carts.total, data: carts.data };
                }
                else {
                    return new common_1.NotFoundException("No carts found");
                }
            }
            else {
                return new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get all carts');
        }
    }
    async findOne(req, cartId) {
        try {
            const cart = await this.cartModel.findOne({ _id: cartId }).populate({ path: "products", populate: { path: "product" } });
            if (cart) {
                if (req.user.user._id.equals(cart.createdBy) || req.user.user.role == 'admin') {
                    return { message: "done", cart };
                }
                else {
                    return new common_1.UnauthorizedException('Unauthorized');
                }
            }
            else {
                return new common_1.NotFoundException('Invalid cart');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to get cart');
        }
    }
    async update(cartId, updateCartDto) {
        try {
            const cart = await this.cartModel.findOneAndUpdate({ _id: cartId }, Object.assign({}, updateCartDto), { new: true });
            if (cart) {
                return { message: "Cart validated successfully", cart };
            }
            else {
                return new common_1.NotFoundException('Invalid cart');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException('Faild to validate cart');
        }
    }
    remove(id) {
        return `This action removes a #${id} cart`;
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Cart')),
    __param(5, (0, mongoose_1.InjectModel)('Product')),
    __param(6, (0, mongoose_1.InjectModel)('Currency')),
    __metadata("design:paramtypes", [config_1.ConfigService, mongoose_2.Model,
        pages_service_1.PagesService, auth_service_1.AuthService, search_service_1.SearchService,
        mongoose_2.Model,
        mongoose_2.Model])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map