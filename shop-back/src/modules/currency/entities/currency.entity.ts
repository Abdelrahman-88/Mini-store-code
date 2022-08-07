import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateCDto } from '../dto/create-c.dto';

@Schema({
    timestamps: true,
  })

export class Currency extends Document {  

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User;
    
    @Prop({ required: true})
    aed: CreateCDto;

    @Prop({ required: true})
    usd: CreateCDto;

    @Prop({ required: true})
    eur: CreateCDto;

    @Prop({ required: true})
    jpy: CreateCDto;
  
    _doc?:any;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);

