import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';
import { Model } from 'mongoose';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userModel;
    private configService;
    constructor(userModel: Model<User>, configService: ConfigService);
    validate(payload: any): Promise<{
        user: User & {
            _id: any;
        };
    }>;
}
export {};
