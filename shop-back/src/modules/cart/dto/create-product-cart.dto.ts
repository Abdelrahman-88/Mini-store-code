import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator"
import { Transform } from 'class-transformer';

export class CreateProductCartDto {

    @ApiProperty({required: true})
    @IsString()
    @MinLength(24)
    @MaxLength(24)
    @IsNotEmpty()
    product:string
    @ApiProperty({required: true,type:Number})
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(1)
    quantity: number
    
    total: number
    
}
