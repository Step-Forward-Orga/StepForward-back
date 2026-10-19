import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Read by AuthGuard.checkRoles
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
