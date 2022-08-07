import mongoose, { Document } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare class Cart extends Document {
    createdBy: User;
    products: {
        quantity: number;
        total: number;
        product: Product;
    }[];
    totalPrice: number;
    currency: string;
    status: string;
    shippingAddress: string;
    contactNumber: string;
    payment: string;
    email: string;
    _doc?: any;
}
export declare const CartSchema: mongoose.Schema<Cart, mongoose.Model<Cart, any, any, any>, {}, {}>;
