import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class idDto{
    @ApiProperty({required: true})
    @IsString()
    @MinLength(24)
    @MaxLength(24)
    @IsNotEmpty()
    id:string
}