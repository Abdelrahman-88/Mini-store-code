import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";

export class FindAllCartDto{
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
    @ApiProperty({required: false,enum: ['open', 'pending', 'closed']})
    @IsEnum(['open', 'pending', 'closed',''])
    @IsOptional()
    status?:string
    @ApiProperty({required: false,enum: [1, -1]})
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @IsEnum([1, -1])
    @IsOptional()
    sort?:number
}