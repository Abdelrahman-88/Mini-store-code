import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import{Model} from 'mongoose'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(@InjectModel(User.name) private readonly userModel:Model<User>,private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findOne({_id:payload._id})    
    if (user) {
      return {user};
    } else {
      throw new UnauthorizedException           
    }
  }
}