import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';
export declare class MailService {
    private mailerService;
    private configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendUserConfirmation(user: User, template: string, subject: string): Promise<any>;
}
