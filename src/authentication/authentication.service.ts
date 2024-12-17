import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentials } from '../errors/InvalidCredentials';
import { InvalidTokenType } from '../errors/InvalidTokenType';

import { SignUpDto } from './dto/sign-up.dto';
import { JwtType } from './enums/JwtType.enum';
import { SignInDto } from './dto/sign-in-dto';
import { JwtPayload } from './contracts/JwtPayload.interface';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async generateTokens(sub: number) {
        const refreshJti = uuid();

        const tokens = {
            accessToken: await this.jwtService.signAsync(
                {
                    type: JwtType.ACCESS,
                    refreshJti,
                    sub
                },
                {
                    jwtid: uuid(),
                    expiresIn: '2h',
                },
            ),
            refreshToken: await this.jwtService.signAsync(
                {
                    type: JwtType.REFRESH,
                    expiresIn: '20d',
                    sub,
                },
                {
                    jwtid: refreshJti
                },
            ),
        }

        return tokens
    }

    async signUp(newUser: SignUpDto) {
        newUser.password = await bcrypt.hash(newUser.password, 10);

        const user = await this.prisma.user.create({ data: newUser });

        const tokens = await this.generateTokens(user.id);

        return { user, tokens }
    }

    async signIn(credentials: SignInDto) {
        const { identification, password } = credentials;

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identification },
                    { username: identification },
                ],
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new InvalidCredentials('Password does not correspond');
        }
        
        const tokens = await this.generateTokens(user.id);
        
        return { user, tokens };
    }

    async refreshTokens(refreshToken: string) {
        const { sub, type, jti } = (await this.jwtService.decode(
            refreshToken,
        )) as JwtPayload;
    
        await this.prisma.user.findUniqueOrThrow({ where: { id: sub } });
    
        if (await this.prisma.revokedToken.findFirst({ where: { jti } }))
            throw new InvalidCredentials();
    
        if (type !== JwtType.REFRESH) throw new InvalidTokenType();
    
        await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_SECRET,
        });
    
        return await this.generateTokens(sub);
    }
    
    async revokeToken(jti: string): Promise<RevokedToken> {
        return await this.prisma.revokedToken.create({
            data: { jti },
        });
    }
}
