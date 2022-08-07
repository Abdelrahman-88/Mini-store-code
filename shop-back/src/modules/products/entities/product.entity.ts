import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

@Schema({
    timestamps: true,
  })
export class Product extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User;

    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    poster: string;
  
    @Prop({ required: true })
    gallery: [string];
  
    @Prop({ required: true })
    inStock: number;
  
    @Prop({ required: true, enum: ['mobile','fashion','game','computer','accessories']})
    category: string;

    @Prop({ required: true })
    price: number;

    // @Prop({ required: true, enum: ['$', '£', '¥', '₽','€']})
    // currency: string;
  
    _doc?:any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

