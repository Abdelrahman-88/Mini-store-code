import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
    @ApiProperty({required: true,enum: ['open', 'pending', 'closed']})
    @IsEnum(['open', 'pending', 'closed'],{message:'status must be a valid enum value[open, pending, closed]'})
    @IsNotEmpty()
    status?:string
}
