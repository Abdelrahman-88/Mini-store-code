import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencySchema } from './entities/currency.entity';

@Module({
  imports:[ConfigModule,AuthModule,MongooseModule.forFeatureAsync([
    {
      name: 'Currency',
      useFactory: () => {
        const schema = CurrencySchema;
        return schema;
      }
    }])
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService]
})
export class CurrencyModule {}
