import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CreatedByDto } from './dto/createdBy.dto';
import { FindAllCartDto } from './dto/findAll-cart.dto';
import { idDto } from './dto/id.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(req: any, userId: CreatedByDto, createCartDto: CreateCartDto): Promise<object>;
    findAll(findAllCartDto: FindAllCartDto): Promise<object>;
    findAllUserCarts(req: any, userId: CreatedByDto, findAllCartDto: FindAllCartDto): Promise<object>;
    findOne(req: any, cartId: idDto): Promise<object>;
    update(cartId: idDto, updateCartDto: UpdateCartDto): Promise<object>;
    remove(id: string): string;
}
