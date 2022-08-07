import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsObject, ValidateNested } from "class-validator"
import { Type } from 'class-transformer';
import { CreateCDto } from "./create-c.dto";


export class CreateCurrencyDto {
    @ApiProperty({required: true})
    @ValidateNested()
    @IsObject()
    @IsNotEmpty()
    @Type(() => CreateCDto)
    aed: CreateCDto;
    @ApiProperty({required: true})
    @ValidateNested()
    @IsObject()
    @IsNotEmpty()
    @Type(() => CreateCDto)
    usd: CreateCDto;
    @ApiProperty({required: true})
    @ValidateNested()
    @IsObject()
    @IsNotEmpty()
    @Type(() => CreateCDto)
    eur: CreateCDto;
    @ApiProperty({required: true})
    @ValidateNested()
    @IsObject()
    @IsNotEmpty()
    @Type(() => CreateCDto)
    jpy: CreateCDto;

}
