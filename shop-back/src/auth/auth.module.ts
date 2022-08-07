import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt.guards';
import { AuthService } from './service/auth/auth.service';
import { JwtStrategy } from './strategie/jwt.strategie';

@Module({
    imports:[
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async (configService:ConfigService)=>({
                secret:configService.get("JWT_SECRET"),
                // signOptions:{expiresIn:configService.get("JWT_EXPIRE")}
            })
        })
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService]
})
export class AuthModule {}
