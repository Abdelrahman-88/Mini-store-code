import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleDto{
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    token:string
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    name:string
    @ApiProperty({name:"profilePic", required: false})
    profilePic:string
}