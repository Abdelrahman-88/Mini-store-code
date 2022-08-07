import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: any): Observable<string>;
    decodeJwt(token: string): any;
}
