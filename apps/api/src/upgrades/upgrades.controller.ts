import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { PasswordChangedGuard } from "../auth/password-changed.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { UpgradesService } from "./upgrades.service";
import { PurchaseUpgradeDto } from "./dto";

@Controller("upgrades")
@UseGuards(AuthGuard, PasswordChangedGuard)
export class UpgradesController {
  constructor(private readonly upgradesService: UpgradesService) {}

  @Post("purchase")
  purchase(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(PurchaseUpgradeDto)) dto: PurchaseUpgradeDto,
  ) {
    return this.upgradesService.purchase(user.sub, dto.upgradeId);
  }
}
