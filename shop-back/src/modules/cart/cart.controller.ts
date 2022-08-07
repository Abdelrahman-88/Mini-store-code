import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CreatedByDto } from './dto/createdBy.dto';
import { FindAllCartDto } from './dto/findAll-cart.dto';
import { idDto } from './dto/id.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/addCart/:createdBy')
  @UsePipes(ValidationPipe)
  create(@Req() req: any,@Param() userId: CreatedByDto,@Body() createCartDto: CreateCartDto) : Promise<object> {
    const {createdBy}=userId 
    return this.cartService.create(req,createdBy,createCartDto);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  @Get('/getAllCart')
  findAll(@Query()findAllCartDto:FindAllCartDto) : Promise<object> {
    return this.cartService.findAll(findAllCartDto);
  }

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  @Get('/getAllUserCart/:createdBy')
  findAllUserCarts(@Req() req: any,@Param() userId: CreatedByDto,@Query()findAllCartDto:FindAllCartDto) : Promise<object> {
    const {createdBy}=userId 
    return this.cartService.findAllUserCarts(req,createdBy,findAllCartDto);
  }

  @hasRoles(UserRole.USER,UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  @Get('/getCart/:id')
  findOne(@Req() req: any,@Param() cartId: idDto) : Promise<object> {
    const{id}=cartId;
    return this.cartService.findOne(req,id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  @Patch('/validateCart/:id')
  update(@Param() cartId: idDto, @Body() updateCartDto: UpdateCartDto) : Promise<object> {
    const{id}=cartId;
    return this.cartService.update(id, updateCartDto);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
