import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
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
import Stripe from 'stripe';

@Injectable()
export class CartService {

  private stripe;

  constructor(private configService:ConfigService,@InjectModel('Cart') private readonly cartModel:Model<Cart>,
  private pagesService:PagesService,private authService: AuthService,private searchService:SearchService
  ,@InjectModel('Product') private readonly productModel:Model<Product>
  ,@InjectModel('Currency') private readonly currencyModel:Model<Currency>){
    this.stripe = new Stripe(process.env.SECRET_kEY_API, {
      apiVersion: '2020-08-27',
    });
  }

  async create(req:any,createdBy:string,createCartDto: CreateCartDto) : Promise<object> {
    try {
      if (req.user.user._id.equals(createdBy)) {
        let error = false;        
        let{products,currency,email,payment,...rest}=createCartDto   
        email = email.toLocaleLowerCase();
        const id = this.configService.get('CURRENCYID');
        const newCurrency = await this.currencyModel.findOne({_id:id})
        const rate = newCurrency[currency].rate        
        let newProducts = [];
            let totalPrice = 0;
            const promises = products.map(async(product) => {
                const valid = await this.productModel.findOne({ _id: product.product });
                if (valid) {
                  product['total'] = (valid.price * product.quantity)*rate;
                  totalPrice += product.total;
                  product['name'] = valid.name;
                  product['price'] = valid.price;
                  product['poster'] = valid.poster;

                  newProducts.push(product);
                } else {                  
                  error = true
                }
            });
            await Promise.all(promises);                        
            if (error) {
              return new NotFoundException('Invalid product')
            } else {
              if (payment == 'card') {
                const confirm = await this.payment(totalPrice,currency,email);                
                if (confirm) {
                  const newCart = new this.cartModel({ createdBy,currency, products: newProducts, totalPrice,email,payment,...rest });
                  const cart = await newCart.save();
                  return {message:"Cart added successfully",cart}
                } else {
                  return new InternalServerErrorException('Faild to add cart')
                }
              } else {
                const newCart = new this.cartModel({ createdBy,currency, products: newProducts, totalPrice,email,payment,...rest });
                const cart = await newCart.save();
                return {message:"Cart added successfully",cart}
              }
            }
      } else {
        return new UnauthorizedException('Unauthorized')
      }
    } catch (error) {                              
      return new InternalServerErrorException('Faild to add cart')
    }
  }

  async payment(total:number,currency:string,email:string){
    try {
      let amount:any;
      if (currency == 'jpy') {
        amount = (total).toFixed(0)
      }else{
        amount = (total*100).toFixed(2).replace(/\.?0+$/, '')
      }
      const charged = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method_types: ['card'],
        receipt_email:email
      });
      const paymentConfirm = await this.stripe.paymentIntents.confirm(
        charged.id,
        { payment_method: "pm_card_visa" }
      );
      return true
    } catch (error) {      
      return false
    }
  }

  async findAll(findAllCartDto:FindAllCartDto) : Promise<object> {
    try {
      const {page,size,status} = findAllCartDto;
      const { skip, limit, currentPage } = this.pagesService.getPages(page, size)
      const carts = await this.searchService.search('', { status }, limit, skip, this.cartModel, [], "", "", "",-1)
      if (carts.data.length) {
        return { message: "done", currentPage, limit, totalPages: carts.totalPages, total: carts.total, data: carts.data };
    } else {
      return new NotFoundException("No carts found");
    }
    } catch (error) {
      return new InternalServerErrorException('Faild to get all carts')
    }
  }

  async findAllUserCarts(req:any,createdBy:string,findAllCartDto:FindAllCartDto) : Promise<object> {
    try {
      if (req.user.user._id.equals(createdBy)) {
        const {page,size,status,sort} = findAllCartDto;
        const { skip, limit, currentPage } = this.pagesService.getPages(page, size)
        const carts = await this.searchService.search('', { createdBy,status }, limit, skip, this.cartModel, [], "", "", "",sort)
        if (carts.data.length) {
        return { message: "done", currentPage, limit, totalPages: carts.totalPages, total: carts.total, data: carts.data };
        } else {
          return new NotFoundException("No carts found");
        }
      } else {
        return new UnauthorizedException('Unauthorized')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to get all carts')
    }
  }

  async findOne(req:any,cartId: string) : Promise<object> {
    try {
      const cart = await this.cartModel.findOne({_id:cartId})
      if (cart) {
        if (req.user.user._id.equals(cart.createdBy)||req.user.user.role=='admin') {
          return {message:"done",cart}
        } else {
          return new UnauthorizedException('Unauthorized')
        }
      } else {
        return new NotFoundException('Invalid cart')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to get cart')
    }
  }

  async update(cartId: string, updateCartDto: UpdateCartDto) : Promise<object> {
    try {
      const cart = await this.cartModel.findOneAndUpdate({_id:cartId},{...updateCartDto},{new:true})
      if (cart) {
        return {message:"Cart validated successfully",cart}
      } else {
        return new NotFoundException('Invalid cart')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to validate cart')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
