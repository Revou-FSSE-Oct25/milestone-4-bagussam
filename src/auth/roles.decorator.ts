import { SetMetadata } from '@nestjs/common';

// This assigns a role "label" to an endpoint (e.g., @Roles('ADMIN'))
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);