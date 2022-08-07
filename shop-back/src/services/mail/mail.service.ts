import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService,private configService:ConfigService) {}

  async sendUserConfirmation(user: User, template:string,subject:string):Promise<any> {

    return await this.mailerService.sendMail({
      to: user.email,
      from:`${subject} <${this.configService.get('SENDER')}>`, // override default from
      subject,
      text: subject,
      html: template, // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name
      },
    });
    
  }
}