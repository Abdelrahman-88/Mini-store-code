
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsEmail } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    name:string
    @ApiProperty({required: true})
    @IsEmail()
    @IsNotEmpty()
    email:string
    @ApiProperty({name:"profilePic", format:'binary',required: false, description: 'png/jpg/jpeg'})
    profilePic:string
}
