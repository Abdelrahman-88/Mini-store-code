"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const mail_module_1 = require("../../services/mail/mail.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("./entities/user.entity");
const pages_service_1 = require("../../services/pages/pages.service");
const upload_service_1 = require("../../services/upload/upload.service");
const auth_module_1 = require("../../auth/auth.module");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [mail_module_1.MailModule, config_1.ConfigModule, auth_module_1.AuthModule, mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: 'User',
                    useFactory: () => {
                        const schema = user_entity_1.UserSchema;
                        return schema;
                    }
                }
            ])
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, pages_service_1.PagesService, upload_service_1.UploadService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map