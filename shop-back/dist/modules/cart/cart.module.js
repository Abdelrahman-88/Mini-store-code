"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../../auth/auth.module");
const mongoose_1 = require("@nestjs/mongoose");
const cart_entity_1 = require("./entities/cart.entity");
const pages_service_1 = require("../../services/pages/pages.service");
const upload_service_1 = require("../../services/upload/upload.service");
const search_service_1 = require("../../services/search/search.service");
const product_entity_1 = require("../products/entities/product.entity");
const currency_entity_1 = require("../currency/entities/currency.entity");
let CartModule = class CartModule {
};
CartModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Product', schema: product_entity_1.ProductSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Currency', schema: currency_entity_1.CurrencySchema }]),
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: 'Cart',
                    useFactory: () => {
                        const schema = cart_entity_1.CartSchema;
                        return schema;
                    }
                }
            ])
        ],
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService, pages_service_1.PagesService, upload_service_1.UploadService, search_service_1.SearchService]
    })
], CartModule);
exports.CartModule = CartModule;
//# sourceMappingURL=cart.module.js.map