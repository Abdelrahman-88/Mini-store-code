import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(private configService:ConfigService,@InjectModel('Currency') private readonly currencyModel:Model<Currency>,
  private authService: AuthService){}

  async create(req:any,createdBy:string,createCurrencyDto: CreateCurrencyDto) : Promise<object> {
    try {
      if (req.user.user._id.equals(createdBy)) {
        const product = new this.currencyModel({createdBy,...createCurrencyDto})
        const data = await product.save()
        return {message:"Currency added successfully",data}
      } else {
        return new UnauthorizedException('Unauthorized')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to add currency')
    }
  }

  findAll() {
    return `This action returns all currency`;
  }

  async findOne() : Promise<object> {
    try {
      const id = this.configService.get('CURRENCYID');
      const currency = await this.currencyModel.findOne({_id:id})
      if (currency) {
        return {message:"done",currency};
      } else {
        return new NotFoundException('Faild to get currency')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to get currency')
    }
  }

  async update(currencyId: string,updateCurrencyDto: UpdateCurrencyDto) : Promise<object> {
    try {
      const currency = await this.currencyModel.findByIdAndUpdate({_id:currencyId},{...updateCurrencyDto},{new:true})
      if (currency) {
        return {message:"Currency updated successfully",currency};
      } else {
        return new NotFoundException('Invalid currency')
      }
    } catch (error) {
      return new InternalServerErrorException('Faild to add currency')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
