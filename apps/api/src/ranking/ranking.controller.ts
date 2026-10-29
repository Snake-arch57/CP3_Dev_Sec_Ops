import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { RankingService } from "./ranking.service";

@Controller("ranking")
@UseGuards(AuthGuard)
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  getRanking(@CurrentUser() user: JwtPayload) {
    return this.rankingService.getRanking(user.sub, user.role);
  }
}
