import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {        
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const role: UserRole = request.user.user.role;

        if (roles.includes(role)) {            
            return request.user.user && true;
        } else {
            throw new UnauthorizedException       
        }    

    
    }
}


