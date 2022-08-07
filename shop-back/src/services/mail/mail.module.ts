import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        transport: {
          service:'gmail',
          auth: {
            user: configService.get('SENDER'),
            pass: configService.get('SENDER_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get('SENDER'),
        }
      })
      
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
