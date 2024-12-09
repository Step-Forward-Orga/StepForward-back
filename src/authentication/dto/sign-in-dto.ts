import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({ example: 'example@mail.com | username',examples: ['example@mail.com', 'username'] })
    @IsString()
    identification: string;

    @ApiProperty({ example: 'StrongPassword123!' })
    @IsString()
    password: string;
}