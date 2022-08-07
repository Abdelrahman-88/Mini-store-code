/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/schemaoptions" />
import { Document } from 'mongoose';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User extends Document {
    name: string;
    email: string;
    password: string;
    profilePic: string;
    verified: boolean;
    reset: boolean;
    socialLogin: boolean;
    role: UserRole;
    _doc?: any;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any>, {}, {}>;
