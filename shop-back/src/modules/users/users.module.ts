import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from 'src/services/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { PagesService } from 'src/services/pages/pages.service';
import { UploadService } from 'src/services/upload/upload.service';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[MailModule,ConfigModule,AuthModule,MongooseModule.forFeatureAsync([
    {
      name: 'User',
      useFactory: () => {
        const schema = UserSchema;
        return schema;
      }
    }])
  ],
  controllers: [UsersController],
  providers: [UsersService,PagesService,UploadService],
  exports: [UsersService]
})
export class UsersModule {}
