import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
export declare class Product extends Document {
    createdBy: User;
    name: string;
    description: string;
    poster: string;
    gallery: [string];
    inStock: number;
    category: string;
    price: number;
    _doc?: any;
}
export declare const ProductSchema: mongoose.Schema<Product, mongoose.Model<Product, any, any, any>, {}, {}>;
