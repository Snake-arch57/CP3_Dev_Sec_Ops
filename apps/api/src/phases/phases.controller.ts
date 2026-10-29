import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { PasswordChangedGuard } from "../auth/password-changed.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { PhasesService } from "./phases.service";
import { SavePhaseResultDto } from "./dto";

@Controller("phases")
@UseGuards(AuthGuard, PasswordChangedGuard)
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @Post("results")
  saveResult(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(SavePhaseResultDto)) dto: SavePhaseResultDto,
  ) {
    return this.phasesService.saveResult(user.sub, dto);
  }
}
