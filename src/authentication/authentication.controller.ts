import { Body, Controller, Delete, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiCookieAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { handleErrors } from '../utils/handle-errors';
import { UserEntity } from '../user/entities/user.entity';
import { ApiResponseBody } from '../responses/ApiResponse';
import { InvalidCredentials } from '../errors/InvalidCredentials';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../decorators/user.decorator';

import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload } from './contracts/JwtPayload.interface';
import { SignInDto } from './dto/sign-in-dto';
import { AuthGuard } from './authentication.guard';

@ApiTags('Auth')
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly prisma: PrismaService,
    ) {}

    @Post('sign-up')
    @ApiOperation({ summary: 'Sign Up', description: 'Allows a user to register with his email, password, username' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Sign Up succesful, jwt and refresh-token sent as cookies', type: UserEntity})
    @ApiResponse({ status: 400, description: 'Bad Request'})
    @ApiResponse({ status: 409, description: 'Conflict'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    async signUp(
        @Body() body: SignUpDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const { user, tokens } = await this.authService.signUp(body);

            res
                .cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/authentication/refresh-token',
                    sameSite: 'none'
                })
                .cookie('jwt', tokens.accessToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                    sameSite: 'none'
                })

            return new UserEntity(user)
        } catch (err: unknown) {
            handleErrors(err)
        }
    }

    @Post('sign-in')
    @ApiOperation({ summary: 'Sign In', description: 'Allows a user to login with his email or username and his password' })
    @ApiBody({ type: SignInDto })
    @ApiResponse({ status: 200, description: 'Sign In succesful, jwt and refresh-token sent as cookies', type: UserEntity })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody })
    @ApiResponse({ status: 404, description: 'Not Found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @HttpCode(200)
    async signIn(
        @Body() body: SignInDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const { user, tokens } = await this.authService.signIn(body);

            res
                .cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/authentication/refresh-token',
                    sameSite: 'none'
                })
                .cookie('jwt', tokens.accessToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                    sameSite: 'none'
                })

            return new UserEntity(user)
        } catch(err: unknown) {
            handleErrors(err)
        }
    }

    @Post('refresh-token')
    @ApiCookieAuth()
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
        if (!req.cookies['refreshToken']) throw new InvalidCredentials();

        res.cookie(
            'jwt',
            (await this.authService.refreshTokens(req.cookies['refreshToken']))
            .accessToken,
            {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            },
        );

        return;
        } catch (err: unknown) {
        if (err instanceof InvalidCredentials) {
            res.clearCookie('jwt');
            res.clearCookie('refreshToken', {
            path: '/authentication/refresh-token',
            });
        }

        handleErrors(err);
        }
    }

    @ApiCookieAuth()
    @UseGuards(AuthGuard)
    @Delete('revoke-token')
    async revokeToken(
        @User() user: JwtPayload,
        @Res({ passthrough: true }) res: Response,
    ) {
        const results = [];

        try {
            // Attempt to revoke the main access token (jti)
            const revokedJti = await this.authService.revokeToken(user.jti);
            results.push(revokedJti);
        } catch (err) {
            console.error('Failed to revoke access token (jti):', err.message);
            results.push(null); // Push null to indicate failure
        }

        try {
            // Attempt to revoke the refresh token (refreshJti) if it exists
            const revokedRefreshJti = user.refreshJti
                ? await this.authService.revokeToken(user.refreshJti)
                : null;
            results.push(revokedRefreshJti);
        } catch (err) {
            results.push(null);
        }

        // Always clear the cookies, regardless of errors
        res.clearCookie('jwt');
        res.clearCookie('refreshToken', { path: '/authentication/refresh-token' });

        return results; // Return the results array
    }
}
