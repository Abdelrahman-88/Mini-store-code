import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './entities/cart.entity';
import { PagesService } from 'src/services/pages/pages.service';
import { UploadService } from 'src/services/upload/upload.service';
import { SearchService } from 'src/services/search/search.service';
import { ProductSchema } from '../products/entities/product.entity';
import { CurrencySchema } from '../currency/entities/currency.entity';


@Module({
  imports:[ConfigModule,AuthModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Currency', schema: CurrencySchema }]),
    MongooseModule.forFeatureAsync([
  {
      name: 'Cart',
      useFactory: () => {
        const schema = CartSchema;
        return schema;
      }
    }])
  ],
  controllers: [CartController],
  providers: [CartService,PagesService,UploadService,SearchService]
})
export class CartModule {}
