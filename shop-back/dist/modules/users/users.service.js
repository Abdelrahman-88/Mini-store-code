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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mail_service_1 = require("../../services/mail/mail.service");
const confirmation_1 = require("../../services/mail/templates/confirmation");
const pages_service_1 = require("../../services/pages/pages.service");
const user_entity_1 = require("./entities/user.entity");
const rxjs_1 = require("rxjs");
const auth_service_1 = require("../../auth/service/auth/auth.service");
const bcrypt = require("bcrypt");
const googleapis_1 = require("googleapis");
const nanoid_1 = require("nanoid");
let UsersService = class UsersService {
    constructor(mailService, configService, userModel, pagesService, authService, connection) {
        this.mailService = mailService;
        this.configService = configService;
        this.userModel = userModel;
        this.pagesService = pagesService;
        this.authService = authService;
        this.connection = connection;
        this.fileModel = new mongoose_2.default.mongo.GridFSBucket(this.connection.db, {
            bucketName: "uploads"
        });
        const clientID = this.configService.get('GOOGLEClientID');
        const clientSecret = this.configService.get('GOOGLEClientSECRET');
        this.oauthClient = new googleapis_1.google.auth.OAuth2(clientID, clientSecret);
    }
    async create(file, createUserDto) {
        try {
            let user;
            let subject = `Confirmation email`;
            let { email } = createUserDto, value = __rest(createUserDto, ["email"]);
            email = email.toLocaleLowerCase();
            const emailExist = await this.userModel.findOne({ email });
            if (emailExist) {
                return new common_1.BadRequestException('Email already exist');
            }
            else {
                if (file) {
                    user = new this.userModel(Object.assign(Object.assign({ email }, value), { profilePic: this.configService.get('USERSURL') + file.filename }));
                }
                else {
                    user = new this.userModel(Object.assign({ email }, value));
                }
                const newUser = await user.save();
                const _a = newUser._doc, { password } = _a, rest = __rest(_a, ["password"]);
                const { _id, role } = rest;
                const data = { _id, role };
                const result = this.authService.generateJwt(data);
                const token = await (0, rxjs_1.lastValueFrom)(result);
                try {
                    const info = await this.mailService.sendUserConfirmation(user, (0, confirmation_1.confirmation)(token), subject);
                    if (info.messageId) {
                        return { message: "Register successfully please verify your email" };
                    }
                    else {
                        return new common_1.InternalServerErrorException('Register successfully but faild to send verification email please try login after some time');
                    }
                }
                catch (error) {
                    return new common_1.InternalServerErrorException('Register successfully but faild to send verification email please try login after some time');
                }
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async updateProfile(id, req, file, updateUserDto) {
        try {
            let updatedUser;
            const user = req.user.user;
            let { email } = updateUserDto, value = __rest(updateUserDto, ["email"]);
            email = email.toLocaleLowerCase();
            const subject = `Confirmation email`;
            const { _id, role } = user;
            const data = { _id, role };
            const emailExist = await this.userModel.findOne({ email });
            if (emailExist) {
                if (email == user.email) {
                    if (file) {
                        updatedUser = await this.userModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({ email }, value), { profilePic: this.configService.get('USERSURL') + file.filename }), { new: true }).select("-password");
                    }
                    else {
                        updatedUser = await this.userModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({ email }, value), { profilePic: user.profilePic }), { new: true }).select("-password");
                    }
                    if (updatedUser) {
                        const result = this.authService.generateJwt(JSON.stringify(updatedUser));
                        const token = await (0, rxjs_1.lastValueFrom)(result);
                        return { message: "Profile updated successfully", token };
                    }
                    else {
                        return new common_1.NotFoundException('Invalid User');
                    }
                }
                else {
                    return new common_1.BadRequestException('Email already exist');
                }
            }
            else {
                if (file) {
                    updatedUser = await this.userModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({ email }, value), { verified: false, profilePic: this.configService.get('USERSURL') + file.filename }), { new: true }).select("-password");
                }
                else {
                    updatedUser = await this.userModel.findOneAndUpdate({ _id: id }, Object.assign(Object.assign({ email }, value), { verified: false, profilePic: user.profilePic }), { new: true }).select("-password");
                }
                if (updatedUser) {
                    const result = this.authService.generateJwt(data);
                    const token = await (0, rxjs_1.lastValueFrom)(result);
                    try {
                        const info = await this.mailService.sendUserConfirmation(updatedUser, (0, confirmation_1.updateConfirmation)(token), subject);
                        if (info.messageId) {
                            return { message: "Profile updated successfully please verify your email" };
                        }
                        else {
                            return new common_1.InternalServerErrorException('Profile updated successfully but faild to send verification email please try login after some time');
                        }
                    }
                    catch (error) {
                        return new common_1.InternalServerErrorException('Profile updated successfully but faild to send verification email please try login after some time');
                    }
                }
                else {
                    return new common_1.NotFoundException('Invalid User');
                }
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async resetLink(resetLinkDto) {
        try {
            let { email } = resetLinkDto;
            email = email.toLocaleLowerCase();
            const subject = `Confirmation email`;
            const emailExist = await this.userModel.findOne({ email }).select('-password');
            if (emailExist) {
                const { _id, role } = emailExist;
                const data = { _id, role };
                const result = this.authService.generateJwt(JSON.stringify(data));
                const token = await (0, rxjs_1.lastValueFrom)(result);
                try {
                    const info = await this.mailService.sendUserConfirmation(emailExist, (0, confirmation_1.resetConfirmation)(token), subject);
                    if (info.messageId) {
                        return { message: "Password reseted successfully please verify your email" };
                    }
                    else {
                        return new common_1.InternalServerErrorException('Faild to send verification email please try after some time');
                    }
                }
                catch (error) {
                    return new common_1.InternalServerErrorException('Faild to send verification email please try after some time');
                }
            }
            else {
                return new common_1.NotFoundException('Invalid Email');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async changePassword(id, req, changePasswordDto) {
        try {
            const user = await this.userModel.findOne({ _id: id, reset: true });
            if (user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);
                const update = await this.userModel.findOneAndUpdate({ _id: id }, { password: hashedPassword, reset: false, socialLogin: false }, { new: true }).select('-password');
                const result = this.authService.generateJwt(update._doc);
                const token = await (0, rxjs_1.lastValueFrom)(result);
                return { message: "Password changed successfully", token };
            }
            else {
                return new common_1.NotFoundException('Invalid User');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async updatePassword(id, req, updatePasswordDto) {
        try {
            const user = await this.userModel.findOne({ _id: id });
            if (user) {
                const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
                if (isMatch) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, salt);
                    const update = await this.userModel.findOneAndUpdate({ _id: id }, { password: hashedPassword });
                    return { message: "Password updated successfully" };
                }
                else {
                    return new common_1.BadRequestException('Invalid old password');
                }
            }
            else {
                return new common_1.NotFoundException('Invalid User');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async displayDocument(res, fileName) {
        try {
            const file = await this.userModel.findOne({ profilePic: this.configService.get('USERSURL') + fileName });
            if (file) {
                let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
                downloadStream = downloadStream.pipe(res);
                downloadStream.on("data", function (data) {
                    return data;
                });
            }
            else {
                let notFoundStream = this.fileModel.openDownloadStreamByName(this.configService.get('NOTFOUND'));
                notFoundStream = notFoundStream.pipe(res);
                notFoundStream.on("data", function (data) {
                    return data;
                });
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async verify(token) {
        try {
            const id = this.authService.decodeJwt(token);
            const find = await this.userModel.findOne({ _id: id });
            if (find) {
                if (find.verified) {
                    return new common_1.BadRequestException('Email already verified');
                }
                else {
                    const verify = await this.userModel.findOneAndUpdate({ _id: id }, { verified: true });
                    if (verify) {
                        return { message: 'Email verified successfully' };
                    }
                    else {
                        return new common_1.NotFoundException('Invalid user');
                    }
                }
            }
            else {
                return new common_1.BadRequestException('Invalid user');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async reset(token) {
        try {
            const id = this.authService.decodeJwt(token);
            const find = await this.userModel.findByIdAndUpdate({ _id: id }, { reset: true });
            if (find) {
                return { message: 'Password reseted successfully' };
            }
            else {
                return new common_1.BadRequestException('Invalid user');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async resendVerificationLink(id) {
        try {
            let subject = `Confirmation email`;
            const user = await this.userModel.findOne({ _id: id });
            if (user) {
                const { _id, role } = user;
                const data = { _id, role };
                const result = this.authService.generateJwt(data);
                const token = await (0, rxjs_1.lastValueFrom)(result);
                try {
                    const info = await this.mailService.sendUserConfirmation(user, (0, confirmation_1.confirmation)(token), subject);
                    if (info.messageId) {
                        return { message: "Verification email sent successfully" };
                    }
                    else {
                        return new common_1.InternalServerErrorException('Faild to send verification email please try later');
                    }
                }
                catch (error) {
                    return new common_1.InternalServerErrorException('Faild to send verification email please try later');
                }
            }
            else {
                return new common_1.NotFoundException('Invalid user');
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async logIn(logInDto) {
        try {
            const user = await this.userModel.findOne({ email: logInDto.email });
            if (user) {
                if (user.verified) {
                    const isMatch = await bcrypt.compare(logInDto.password, user.password);
                    if (isMatch) {
                        const _a = user._doc, { password } = _a, rest = __rest(_a, ["password"]);
                        return this.authService.generateJwt(rest).pipe((0, rxjs_1.map)((jwt) => {
                            return {
                                message: "Login successfully",
                                token: jwt
                            };
                        }));
                    }
                    else {
                        return new common_1.NotFoundException({ error: "Invalid email or password" });
                    }
                }
                else {
                    const { _id, role } = user;
                    const data = { _id, role };
                    const result = this.authService.generateJwt(data);
                    const token = await (0, rxjs_1.lastValueFrom)(result);
                    return new common_1.BadRequestException({ error: "Unverified email", token });
                }
            }
            else {
                return new common_1.NotFoundException({ error: "Invalid email or password" });
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    async googleLogin(googleDto) {
        try {
            const { token } = googleDto, rest = __rest(googleDto, ["token"]);
            const tokenInfo = await this.oauthClient.getTokenInfo(token);
            if (tokenInfo) {
                let { email_verified, email } = tokenInfo;
                email = email.toLowerCase();
                if (email_verified) {
                    const user = await this.userModel.findOne({ email }).select('-password');
                    if (user) {
                        const result = this.authService.generateJwt(user._doc);
                        const token = await (0, rxjs_1.lastValueFrom)(result);
                        return {
                            message: "Login successfully",
                            token
                        };
                    }
                    else {
                        const newUser = new this.userModel(Object.assign(Object.assign({ email }, rest), { verified: true, password: (0, nanoid_1.nanoid)(), reset: true, socialLogin: true }));
                        const savedUser = await newUser.save();
                        const _a = savedUser._doc, { password } = _a, value = __rest(_a, ["password"]);
                        const result = this.authService.generateJwt(value);
                        const token = await (0, rxjs_1.lastValueFrom)(result);
                        return {
                            message: "Login successfully",
                            token
                        };
                    }
                }
                else {
                    return new common_1.NotFoundException({ error: "No user from google" });
                }
            }
            else {
                return new common_1.NotFoundException({ error: "No user from google" });
            }
        }
        catch (error) {
            return new common_1.InternalServerErrorException(error);
        }
    }
    findAll() {
        return `This action returns all users`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(5, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mail_service_1.MailService, config_1.ConfigService, mongoose_2.Model,
        pages_service_1.PagesService, auth_service_1.AuthService,
        mongoose_2.Connection])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map