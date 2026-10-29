import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { buildPlayerProfile } from "../players/build-profile";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { BootstrapAdminDto, ChangePasswordDto, LoginDto } from "./dto";
import { AuthGuard } from "./auth.guard";
import { CurrentUser } from "./current-user.decorator";
import type { JwtPayload } from "./jwt-payload";
import { SESSION_COOKIE_NAME } from "./auth.constants";

const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  private setSessionCookie(res: Response, token: string) {
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE_MS,
      path: "/",
    });
  }

  @Get("status")
  async status() {
    return { needsBootstrap: await this.authService.needsBootstrap() };
  }

  @Post("bootstrap-admin")
  async bootstrapAdmin(
    @Body(new ZodValidationPipe(BootstrapAdminDto)) dto: BootstrapAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.bootstrapAdmin(dto);
    this.setSessionCookie(res, this.authService.issueToken(user));
    return buildPlayerProfile(this.prisma, user.id);
  }

  @Post("login")
  async login(
    @Body(new ZodValidationPipe(LoginDto)) dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto);
    this.setSessionCookie(res, this.authService.issueToken(user));
    return buildPlayerProfile(this.prisma, user.id);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return { ok: true };
  }

  @UseGuards(AuthGuard)
  @Post("change-password")
  async changePassword(
    @CurrentUser() currentUser: JwtPayload,
    @Body(new ZodValidationPipe(ChangePasswordDto)) dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.changePassword(currentUser.sub, dto);
    this.setSessionCookie(res, this.authService.issueToken(user));
    return buildPlayerProfile(this.prisma, user.id);
  }
}
