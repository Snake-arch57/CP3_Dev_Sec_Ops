import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common";
import type { Role } from "@prisma/client";
import type { JwtPayload } from "./jwt-payload";

export function RequireRole(role: Role) {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user: JwtPayload | undefined = request.user;
      if (!user || user.role !== role) {
        throw new ForbiddenException("Acesso restrito.");
      }
      return true;
    }
  }
  return RoleGuardMixin;
}
