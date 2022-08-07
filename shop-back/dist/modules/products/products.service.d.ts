/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { Connection, Model } from 'mongoose';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { PagesService } from 'src/services/pages/pages.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { SearchService } from 'src/services/search/search.service';
import { FindAllProductDto } from './dto/findAll-product.dto';
export declare class ProductsService {
    private configService;
    private readonly productModel;
    private pagesService;
    private authService;
    private searchService;
    private readonly connection;
    private fileModel;
    constructor(configService: ConfigService, productModel: Model<Product>, pagesService: PagesService, authService: AuthService, searchService: SearchService, connection: Connection);
    create(req: any, createdBy: string, files: {
        gallery?: Express.Multer.File[];
        poster?: Express.Multer.File[];
    }, createProductDto: CreateProductDto): Promise<object>;
    findAll(findAllProductDto: FindAllProductDto): Promise<object>;
    findOne(productId: string): Promise<object>;
    update(req: any, productId: string, files: {
        gallery?: Express.Multer.File[];
        poster?: Express.Multer.File[];
    }, updateProductDto: UpdateProductDto): Promise<object>;
    displayGallery(res: any, fileName: string): Promise<any>;
    remove(id: number): string;
}
