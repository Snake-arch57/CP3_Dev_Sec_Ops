import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { PlayersService } from "./players.service";

@Controller("players")
@UseGuards(AuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get("me")
  getMe(@CurrentUser() user: JwtPayload) {
    return this.playersService.getProfile(user.sub);
  }
}
