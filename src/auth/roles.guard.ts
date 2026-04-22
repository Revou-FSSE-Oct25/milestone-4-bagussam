import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If the endpoint doesn't have the @Roles() decorator, let it pass
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Check if the user has the required role
    const hasRole = requiredRoles.some((role) => user?.role === role);
    if (!hasRole) {
      throw new ForbiddenException('You do not have access (Not an Admin)');
    }

    return true;
  }
}