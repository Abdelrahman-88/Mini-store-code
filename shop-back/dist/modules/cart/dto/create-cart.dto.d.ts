import { CreateProductCartDto } from "./create-product-cart.dto";
export declare class CreateCartDto {
    products: CreateProductCartDto[];
    currency: string;
    payment: string;
    shippingAddress: string;
    contactNumber: string;
    email: string;
}
