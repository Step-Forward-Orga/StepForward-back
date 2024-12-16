import { Controller, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiCookieAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { handleErrors } from '../utils/handle-errors';
import { ApiResponseBody } from '../responses/ApiResponse';

import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('password')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update Password', description: 'Updates the user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'OK',  content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type:'string' }, } }, example: { "success": true, "message": "Password updated successfully." } } }})
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updatePassword(
    @User() user: JwtPayload,
    @Body() body: UpdatePasswordDto,
  ) {
    try {
      await this.userService.updatePassword(
        user.sub,
        body.oldPassword,
        body.newPassword,
        body.newPasswordConfirm,
      );

      return { success: true, message: 'Password updated successfully.' };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Patch('email')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update Email', description: 'Updates the user email' })
  @ApiBody({ type: UpdateEmailDto })
  @ApiResponse({ status: 200, description: 'OK',  content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type:'string' }, } }, example: { "success": true, "message": "Email updated successfully." } } }})
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateEmail(@User() user: JwtPayload, @Body() body: UpdateEmailDto) {
    try {
      await this.userService.updateEmail(user.sub, body.newEmail);

      return { success: true, message: 'Email updated successfully.' };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
