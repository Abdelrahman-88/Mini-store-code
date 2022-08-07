import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator"
import { Transform } from 'class-transformer';

export class CreateCDto {

    @ApiProperty({required: true,enum: ['$', 'د.إ', '¥','€']})
    @IsNotEmpty()
    @IsEnum(['$', 'د.إ', '¥','€'])
    sign:string
    @ApiProperty({required: true,type:Number})
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(0)
    rate: number
    @ApiProperty({required: true,enum: ['usd', 'aed', 'jpy','eur']})
    @IsNotEmpty()
    @IsEnum(['usd', 'aed', 'jpy','eur'])
    code:string
    
}
