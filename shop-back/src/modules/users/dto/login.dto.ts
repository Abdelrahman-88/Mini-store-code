import {  ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDto {

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsEmail()
    email:string
    @ApiProperty({required: true})
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/, {
        message:
          'Invalid password',
      })
    @IsNotEmpty()
    @IsString()
    password:string


}
