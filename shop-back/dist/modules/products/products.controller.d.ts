/// <reference types="multer" />
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { idDto } from './dto/id.dto';
import { FindAllProductDto } from './dto/findAll-product.dto';
import { CreatedByDto } from './dto/createdBy.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(adminId: CreatedByDto, req: any, files: {
        gallery?: Express.Multer.File[];
        poster?: Express.Multer.File[];
    }, createProductDto: CreateProductDto): Promise<object>;
    findAll(findAllProductDto: FindAllProductDto): Promise<object>;
    findOne(productId: idDto): Promise<object>;
    update(productId: idDto, req: any, files: {
        gallery?: Express.Multer.File[];
        poster?: Express.Multer.File[];
    }, updateProductDto: UpdateProductDto): Promise<object>;
    displayGallery(res: any, fileName: string): Promise<any>;
    remove(id: string): string;
}
