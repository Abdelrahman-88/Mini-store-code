import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FindAllProductDto{
    @ApiProperty({required: false})
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(1)
    @IsOptional()
    page?:number
    @ApiProperty({required: false})
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @Min(1)
    @IsOptional()
    size?:number
    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    search?:string
    @ApiProperty({required: false,enum: ['mobile','fashion','game','computer','accessories']})
    @IsEnum(['mobile','fashion','game','computer','accessories',''],{message:'category must be a valid enum value [mobile,fashion,game,computer,accessories]'})
    @IsOptional()
    category?:string
}