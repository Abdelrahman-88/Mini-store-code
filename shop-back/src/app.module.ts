import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchService } from './services/search/search.service';
import { CartModule } from './modules/cart/cart.module';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
  imports: [UsersModule, ProductsModule,ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({ 
      uri: configService.get('CONNECTION'),
      connectionFactory: (connection) => {
        // connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    })
  }),
  CartModule,
  CurrencyModule],
  controllers: [AppController],
  providers: [AppService, SearchService],
})
export class AppModule {}
