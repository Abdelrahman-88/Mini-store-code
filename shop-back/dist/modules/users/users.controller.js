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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("../../services/upload/upload.service");
const login_dto_1 = require("./dto/login.dto");
const roles_decorator_1 = require("./../../auth/decorators/roles.decorator");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const user_entity_1 = require("./entities/user.entity");
const jwt_guards_1 = require("../../auth/guards/jwt.guards");
const id_dto_1 = require("./dto/id.dto");
const updatePassword_dto_1 = require("./dto/updatePassword.dto");
const resetLink_dto_1 = require("./dto/resetLink.dto");
const changePassword_dto_1 = require("./dto/changePassword.dto");
const google_dto_1 = require("./dto/google.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(file, createUserDto) {
        return this.usersService.create(file, createUserDto);
    }
    displayDocument(res, fileName) {
        return this.usersService.displayDocument(res, fileName);
    }
    verify(token) {
        return this.usersService.verify(token);
    }
    reset(token) {
        return this.usersService.reset(token);
    }
    resetLink(resetLinkDto) {
        return this.usersService.resetLink(resetLinkDto);
    }
    resendVerificationLink(userId) {
        const { id } = userId;
        return this.usersService.resendVerificationLink(id);
    }
    logIn(logInDto) {
        return this.usersService.logIn(logInDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    updateProfile(userId, req, file, updateUserDto) {
        const { id } = userId;
        return this.usersService.updateProfile(id, req, file, updateUserDto);
    }
    updatePassword(userId, req, updatePasswordDto) {
        const { id } = userId;
        return this.usersService.updatePassword(id, req, updatePasswordDto);
    }
    changePassword(userId, req, changePasswordDto) {
        const { id } = userId;
        return this.usersService.changePassword(id, req, changePasswordDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
    googleAuthRedirect(googleDto) {
        return this.usersService.googleLogin(googleDto);
    }
};
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('/register'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePic', upload_service_1.multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/file/:fileName'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "displayDocument", null);
__decorate([
    (0, common_1.Get)('/verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('/reset/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)('/resetLink'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetLink_dto_1.ResetLinkDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetLink", null);
__decorate([
    (0, common_1.Get)('/reSend/:id'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resendVerificationLink", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/logIn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logIn", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Patch)('/updateProfile/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePic', upload_service_1.multerOptions)),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, Object, Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Patch)('/updatePassword/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, Object, updatePassword_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Patch)('/changePassword/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDto, Object, changePassword_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('google'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_dto_1.GoogleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "googleAuthRedirect", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map