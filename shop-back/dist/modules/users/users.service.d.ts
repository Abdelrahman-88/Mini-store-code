/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { Connection, Model } from 'mongoose';
import { MailService } from 'src/services/mail/mail.service';
import { PagesService } from 'src/services/pages/pages.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ResetLinkDto } from './dto/resetLink.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { Auth } from 'googleapis';
import { GoogleDto } from './dto/google.dto';
export declare class UsersService {
    private mailService;
    private configService;
    private readonly userModel;
    private pagesService;
    private authService;
    private readonly connection;
    private fileModel;
    oauthClient: Auth.OAuth2Client;
    constructor(mailService: MailService, configService: ConfigService, userModel: Model<User>, pagesService: PagesService, authService: AuthService, connection: Connection);
    create(file: Express.Multer.File, createUserDto: CreateUserDto): Promise<object>;
    updateProfile(id: string, req: any, file: Express.Multer.File, updateUserDto: UpdateUserDto): Promise<object>;
    resetLink(resetLinkDto: ResetLinkDto): Promise<object>;
    changePassword(id: string, req: any, changePasswordDto: ChangePasswordDto): Promise<object>;
    updatePassword(id: string, req: any, updatePasswordDto: UpdatePasswordDto): Promise<object>;
    displayDocument(res: any, fileName: string): Promise<any>;
    verify(token: string): Promise<object>;
    reset(token: string): Promise<object>;
    resendVerificationLink(id: string): Promise<object>;
    logIn(logInDto: LoginDto): Promise<object>;
    googleLogin(googleDto: GoogleDto): Promise<object>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
