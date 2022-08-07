import {  ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from './match';

export class UpdatePasswordDto {
    @ApiProperty({required: true})
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/, {
        message:
          'Invalid old password',
      })
    @IsNotEmpty()
    oldPassword:string
    @ApiProperty({required: true})
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/, {
        message:
          'New password should contain at least 8 characters (1 number, 1 lowercase character, 1 uppercase character , 1 special character(@,$,&,_))',
      })
    @IsNotEmpty()
    newPassword:string
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    @Match('newPassword', {
        message:
          'Confirm new password doesnot match new password',
      })
    cNewPassword: string;

}
