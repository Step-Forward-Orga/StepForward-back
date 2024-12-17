import {
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InvalidCredentials } from '../errors/InvalidCredentials';
import { InvalidTokenType } from '../errors/InvalidTokenType';

// handle prisma errors
//--------------------------------------------------------------------------
export function handlePrismaErrors(error: unknown, message? : string) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return;

    switch (error.code) {
        case 'P2002':
            throw new ConflictException(message ?? error.message);

        case 'P2003':
            throw new NotFoundException(message ?? error.message);

        case 'P2025':
            throw new NotFoundException(message ?? error.message);

        default:
            console.error(error);
            throw new InternalServerErrorException(message ?? error.message);
    }
}

// handle errors common errors
//--------------------------------------------------------------------------
export function handleErrors(err: unknown, message? : string) {
    if (
        err instanceof InvalidCredentials ||
        err instanceof InvalidTokenType ||
        (err instanceof Error && err.name === 'JsonWebTokenError')
    )
    throw new UnauthorizedException(message ?? err.message);

    if (err instanceof HttpException) throw err;

    if (err instanceof ConflictException) throw new ConflictException(message ?? err.message);

    handlePrismaErrors(err);

    throw new InternalServerErrorException(message ?? '');
}
