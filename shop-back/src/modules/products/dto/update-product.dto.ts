import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator"
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    name:string
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    description:string
    @ApiProperty({name:"poster", format:'binary',required: true, description: 'png/jpg/jpeg/webp'})
    poster: string;
    @ApiProperty({name:"gallery", format:'binary',required: true, description: 'png/jpg/jpeg/webp'})
    gallery:[string]
    @ApiProperty({required: true,type:Number})
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(0)
    inStock:number
    @ApiProperty({required: true,enum: ['mobile','fashion','game','computer','accessories']})
    @IsNotEmpty()
    @IsEnum(['mobile','fashion','game','computer','accessories'])
    category:string
    @ApiProperty({required: true,type:Number})
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(0)
    price: number
}
