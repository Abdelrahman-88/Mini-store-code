import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { PagesService } from 'src/services/pages/pages.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { SearchService } from 'src/services/search/search.service';
import { FindAllProductDto } from './dto/findAll-product.dto';

@Injectable()
export class ProductsService {

  private fileModel: any;
  constructor(private configService:ConfigService,@InjectModel('Product') private readonly productModel:Model<Product>,
  private pagesService:PagesService,private authService: AuthService,private searchService:SearchService,
  @InjectConnection() private readonly connection: Connection){
    this.fileModel = new mongoose.mongo.GridFSBucket(this.connection.db , {
      bucketName: "uploads"
  })
  }

  async create(req:any,createdBy:string,files: { gallery?: Express.Multer.File[], poster?: Express.Multer.File[] },createProductDto: CreateProductDto) : Promise<object> {
    try {      
      if (req.fileValidationError) {
        return new BadRequestException(req.fileValidationError)
      } else {
        if (req.user.user._id.equals(createdBy)) {        
          if (files.gallery&&files.poster) {        
            let gallery =[];
            files.gallery.map((file)=>{gallery.push(file.filename)})
            const poster = files.poster[0].filename
            const product = new this.productModel({createdBy,poster,gallery,...createProductDto})
            const data = await product.save()
            return {message:"Product added successfully",data}
          } else {
            return new BadRequestException('Gallery and poster is required')
          }
        } else {
          return new UnauthorizedException('Unauthorized')
        }
      }
    } catch (error) {            
      return new InternalServerErrorException('Faild to add product')
    }
  }

  async findAll(findAllProductDto:FindAllProductDto) : Promise<object> {
    try {
      const {page,size,search,category} = findAllProductDto;
      const { skip, limit, currentPage } = this.pagesService.getPages(page, size)
      const products = await this.searchService.search(search, { category }, limit, skip, this.productModel, ['name'], "", "", "",-1)
      if (products.data.length) {
        return { message: "done", currentPage, limit, totalPages: products.totalPages, total: products.total, data: products.data };
    } else {
      return new NotFoundException("No products found");
    }
    } catch (error) {
      return new InternalServerErrorException('Faild to get all products')
    }
  }

  async findOne(productId: string) : Promise<object> {
    try {
      const product = await this.productModel.findOne({_id:productId})
      if (product) {
        return {message:"done",product}
      } else {
        return new NotFoundException('Invalid product')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to get product')
    }
  }

  async update(req:any,productId: string,files: { gallery?: Express.Multer.File[], poster?: Express.Multer.File[] }, updateProductDto: UpdateProductDto) : Promise<object>{
    try {      
      if (req.fileValidationError) {
        return new BadRequestException(req.fileValidationError)
      } else {
        const find = await this.productModel.findOne({_id:productId})
        if (find) {
          if (files.gallery&&files.poster) {
            let gallery =[];
            files.gallery.map((file)=>{gallery.push(file.filename)})
            const poster = files.poster[0].filename
            const updated = await this.productModel.findOneAndUpdate({_id:productId},{gallery,poster,...updateProductDto},{new:true})
            return {message:"Product updated successfully",updated};
          } else {
            return new BadRequestException('Gallery and poster is required')
          }
        } else {
          return new NotFoundException('Invalid product')
        }
      }
    } catch (error) {      
      return new InternalServerErrorException('Faild to update product')
    }
  }


  async displayGallery(res:any,fileName:string):Promise<any>{
    try {      
        const file = await this.productModel.findOne({gallery:fileName});
        if (file) {
            let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
            downloadStream = downloadStream.pipe(res)            
            downloadStream.on("data", function(data:any) {
              return data;
            });
        } else {
          const poster = await this.productModel.findOne({poster:fileName});
          if (poster) {
            let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
            downloadStream = downloadStream.pipe(res)            
            downloadStream.on("data", function(data:any) {
              return data;
            });
          } else {
            let notFoundStream = this.fileModel.openDownloadStreamByName(this.configService.get('NOTFOUND'));
            notFoundStream = notFoundStream.pipe(res) 
            notFoundStream.on("data", function(data:any) {
              return data;
            });
          }
        }
    } catch (error) {
      return new InternalServerErrorException(error)
    }
}

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
