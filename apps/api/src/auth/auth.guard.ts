import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { JwtPayload } from "./jwt-payload";
import { SESSION_COOKIE_NAME } from "./auth.constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token: string | undefined = request.cookies?.[SESSION_COOKIE_NAME];
    if (!token) throw new UnauthorizedException("Sessão não encontrada.");

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }
  }
}
