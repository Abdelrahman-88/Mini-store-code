/// <reference types="multer" />
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { idDto } from './dto/id.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ResetLinkDto } from './dto/resetLink.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { GoogleDto } from './dto/google.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(file: Express.Multer.File, createUserDto: CreateUserDto): Promise<object>;
    displayDocument(res: any, fileName: string): Promise<any>;
    verify(token: string): Promise<object>;
    reset(token: string): Promise<object>;
    resetLink(resetLinkDto: ResetLinkDto): Promise<object>;
    resendVerificationLink(userId: idDto): Promise<object>;
    logIn(logInDto: LoginDto): Promise<object>;
    findAll(): string;
    findOne(id: string): string;
    updateProfile(userId: idDto, req: any, file: Express.Multer.File, updateUserDto: UpdateUserDto): Promise<object>;
    updatePassword(userId: idDto, req: any, updatePasswordDto: UpdatePasswordDto): Promise<object>;
    changePassword(userId: idDto, req: any, changePasswordDto: ChangePasswordDto): Promise<object>;
    remove(id: string): string;
    googleAuthRedirect(googleDto: GoogleDto): Promise<object>;
}
