import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { comparePassword, hashPassword } from "../common/password.util";
import type { BootstrapAdminDto, ChangePasswordDto, LoginDto } from "./dto";
import type { JwtPayload } from "./jwt-payload";
import { JWT_EXPIRES_IN } from "./auth.constants";

export type SafeUser = Omit<User, "passwordHash">;

function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async bootstrapAdmin(dto: BootstrapAdminDto): Promise<SafeUser> {
    const existingCount = await this.prisma.user.count();
    if (existingCount > 0) {
      throw new ForbiddenException(
        "Já existe um administrador cadastrado. Peça para um admin criar sua conta.",
      );
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username.toLowerCase(),
        passwordHash,
        displayName: dto.displayName,
        role: "ADMIN",
        mustChangePassword: false,
      },
    });
    return toSafeUser(user);
  }

  async login(dto: LoginDto): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username.toLowerCase() } });
    if (!user) throw new UnauthorizedException("Usuário ou senha inválidos.");

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Usuário ou senha inválidos.");

    return toSafeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const valid = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException("Senha atual incorreta.");

    const passwordHash = await hashPassword(dto.newPassword);
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, mustChangePassword: false },
    });
    return toSafeUser(updated);
  }

  issueToken(user: SafeUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };
    return this.jwtService.sign(payload, { expiresIn: JWT_EXPIRES_IN });
  }

  async needsBootstrap(): Promise<boolean> {
    const count = await this.prisma.user.count();
    return count === 0;
  }

  async findSafeUserById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toSafeUser(user) : null;
  }
}
