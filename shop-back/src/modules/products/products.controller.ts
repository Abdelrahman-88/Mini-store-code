import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, UsePipes, ValidationPipe, Req, Res, Query, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/services/upload/upload.service';
import { idDto } from './dto/id.dto';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FindAllProductDto } from './dto/findAll-product.dto';
import { CreatedByDto } from './dto/createdBy.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @Post('/addProduct/:createdBy')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'gallery', maxCount: 10 },
    { name: 'poster', maxCount: 1 }
  ],multerOptions))
  @UsePipes(ValidationPipe)
  create(@Param() adminId: CreatedByDto,@Req() req: any,@UploadedFiles() files: { gallery?: Express.Multer.File[], poster?: Express.Multer.File[] },@Body() createProductDto: CreateProductDto) : Promise<object> {
    const {createdBy}=adminId   
    return this.productsService.create(req,createdBy,files,createProductDto);
  }
  
  @UsePipes(ValidationPipe)
  @Get('/getAllProduct')
  findAll(@Query()findAllProductDto:FindAllProductDto) : Promise<object> {
    return this.productsService.findAll(findAllProductDto);
  }

  @UsePipes(ValidationPipe)
  @Get('/getProduct/:id')
  findOne(@Param() productId: idDto) : Promise<object> {
    const{id}=productId;
    return this.productsService.findOne(id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'gallery', maxCount: 10 },
    { name: 'poster', maxCount: 1 }
  ],multerOptions))  @UsePipes(ValidationPipe)
  @Patch('/updateProduct/:id')
  update(@Param() productId: idDto,@Req() req: any,@UploadedFiles() files: { gallery?: Express.Multer.File[], poster?: Express.Multer.File[] }, @Body() updateProductDto: UpdateProductDto) : Promise<object>{
    const{id}=productId;
    return this.productsService.update(req,id,files, updateProductDto);
  }

  @Get('/file/:fileName')
  displayGallery(@Res() res: any,@Param('fileName') fileName: string):Promise<any> {
    return this.productsService.displayGallery(res,fileName);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
