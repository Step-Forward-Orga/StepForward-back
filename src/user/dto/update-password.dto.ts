import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: "OldPassword123!" })
  @IsStrongPassword()
  oldPassword: string;

  @ApiProperty({ example: "NewPassword123!" })
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({ example: "NewPassword123!" })
  @IsStrongPassword()
  newPasswordConfirm
}
