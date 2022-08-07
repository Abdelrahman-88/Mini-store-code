import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, ValidateNested } from "class-validator"
import { plainToInstance, Transform, Type } from 'class-transformer';
import { CreateProductCartDto } from "./create-product-cart.dto";

export class CreateCartDto {

    @ApiProperty({required: true,type:[CreateProductCartDto]})
    @ValidateNested({ each: true })
    // @Transform(({ value }) => plainToInstance(CreateProductCartDto, JSON.parse(value)))
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => CreateProductCartDto)
    products: CreateProductCartDto[];
    @ApiProperty({required: true,enum: ['usd', 'aed', 'jpy','eur']})
    @IsNotEmpty()
    @IsEnum(['usd', 'aed', 'jpy','eur'])
    currency:string
    @ApiProperty({required: true,enum: ['card', 'cash']})
    @IsNotEmpty()
    @IsEnum(['card', 'cash'])
    payment:string
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    shippingAddress: string
    @ApiProperty({required: true})
    @Matches(/^(010|011|012|015)[0-9]{8}$/, {
        message:
          'Contact number should be such as 010********',
      })
    @IsNotEmpty()
    contactNumber:string;
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsEmail()
    email:string
        
}
