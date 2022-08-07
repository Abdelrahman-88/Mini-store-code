import {  ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from './match';

export class CreateUserDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    name:string
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsEmail()
    email:string
    @ApiProperty({name:"profilePic", format:'binary',required: false, description: 'png/jpg/jpeg'})
    profilePic:string
    @ApiProperty({required: true})
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/, {
        message:
          'Password should contain at least 8 characters (1 number, 1 lowercase character, 1 uppercase character , 1 special character(@,$,&,_))',
      })
    @IsNotEmpty()
    password:string
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    @Match('password', {
        message:
          'cPassword doesnot match password',
      })
    cPassword: string;

}
