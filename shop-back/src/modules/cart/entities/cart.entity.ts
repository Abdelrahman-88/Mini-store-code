import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Schema({
    timestamps: true,
  })
export class Cart extends Document{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User;
  
    @Prop({
        required: true, type:[{quantity:{type:Number,required: true}, total:{type:Number}, product:{type:mongoose.Schema.Types.ObjectId, ref: 'Product',required: true},_id:false}]
      })
    products: { quantity: number; total: number; product: Product; }[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ required: true, enum: ['usd', 'aed', 'jpy','eur']})
    currency: string;

    @Prop({enum: ['open', 'pending', 'closed'],default:'open'})
    status: string;

    @Prop({ required: true })
    shippingAddress:string;

    @Prop({ required: true })
    contactNumber:string;

    @Prop({enum: ['card', 'cash']})
    payment: string;

    @Prop({ required: true, lowercase: true })
    email: string;
  
    _doc?:any;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

