import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PagesService } from 'src/services/pages/pages.service';
import { UploadService } from 'src/services/upload/upload.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { SearchService } from 'src/services/search/search.service';

@Module({
  imports:[ConfigModule,AuthModule,MongooseModule.forFeatureAsync([
    {
      name: 'Product',
      useFactory: () => {
        const schema = ProductSchema;
        return schema;
      }
    }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService,PagesService,UploadService,SearchService]
})
export class ProductsModule {}
