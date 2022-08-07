import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import {  User, UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService){
          
    }
    generateJwt(user:any):Observable<string>{      
        return from(this.jwtService.signAsync(user))
 
 
      }

      decodeJwt(token:string){
        const decoded:any = this.jwtService.decode(token)
        return decoded._id
      }
}
