import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common";
import type { JwtPayload } from "./jwt-payload";

@Injectable()
export class PasswordChangedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload | undefined = request.user;
    if (user?.mustChangePassword) {
      throw new ForbiddenException("Troque sua senha provisória antes de continuar.");
    }
    return true;
  }
}
