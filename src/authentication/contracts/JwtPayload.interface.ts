import { Role } from '@prisma/client';
import { JwtType } from '../enums/JwtType.enum';

export interface JwtPayload {
  sub: number;
  exp: number;
  jti: string;
  iat: number;
  type: JwtType;
  refreshJti?: string;
  roles?: Role[]; // set by AuthGuard from the database, not from the token
}
