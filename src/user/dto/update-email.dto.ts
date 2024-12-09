import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ example: "example@mail.com" })
  @IsEmail()
  newEmail: string;
}
