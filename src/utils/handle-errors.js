"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaErrors = handlePrismaErrors;
exports.handleErrors = handleErrors;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var InvalidCredentials_1 = require("../errors/InvalidCredentials");
var InvalidTokenType_1 = require("../errors/InvalidTokenType");
// handle prisma errors
//--------------------------------------------------------------------------
function handlePrismaErrors(error, message) {
    if (!(error instanceof client_1.Prisma.PrismaClientKnownRequestError))
        return;
    switch (error.code) {
        case 'P2002':
            throw new common_1.ConflictException(message !== null && message !== void 0 ? message : error.message);
        case 'P2003':
            throw new common_1.NotFoundException(message !== null && message !== void 0 ? message : error.message);
        case 'P2025':
            throw new common_1.NotFoundException(message !== null && message !== void 0 ? message : error.message);
        default:
            console.error(error);
            throw new common_1.InternalServerErrorException(message !== null && message !== void 0 ? message : error.message);
    }
}
// handle errors common errors
//--------------------------------------------------------------------------
function handleErrors(err, message) {
    if (err instanceof InvalidCredentials_1.InvalidCredentials ||
        err instanceof InvalidTokenType_1.InvalidTokenType ||
        (err instanceof Error && err.name === 'JsonWebTokenError'))
        throw new common_1.UnauthorizedException(message !== null && message !== void 0 ? message : err.message);
    if (err instanceof common_1.HttpException)
        throw err;
    if (err instanceof common_1.ConflictException)
        throw new common_1.ConflictException(message !== null && message !== void 0 ? message : err.message);
    handlePrismaErrors(err);
    throw new common_1.InternalServerErrorException(message !== null && message !== void 0 ? message : '');
}
