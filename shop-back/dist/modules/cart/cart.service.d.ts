import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { PagesService } from 'src/services/pages/pages.service';
import { SearchService } from 'src/services/search/search.service';
import { Currency } from '../currency/entities/currency.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { FindAllCartDto } from './dto/findAll-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
export declare class CartService {
    private configService;
    private readonly cartModel;
    private pagesService;
    private authService;
    private searchService;
    private readonly productModel;
    private readonly currencyModel;
    private stripe;
    constructor(configService: ConfigService, cartModel: Model<Cart>, pagesService: PagesService, authService: AuthService, searchService: SearchService, productModel: Model<Product>, currencyModel: Model<Currency>);
    create(req: any, createdBy: string, createCartDto: CreateCartDto): Promise<object>;
    payment(total: number, currency: string, email: string): Promise<boolean>;
    findAll(findAllCartDto: FindAllCartDto): Promise<object>;
    findAllUserCarts(req: any, createdBy: string, findAllCartDto: FindAllCartDto): Promise<object>;
    findOne(req: any, cartId: string): Promise<object>;
    update(cartId: string, updateCartDto: UpdateCartDto): Promise<object>;
    remove(id: number): string;
}
