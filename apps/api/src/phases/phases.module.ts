import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PlayersModule } from "../players/players.module";
import { PhasesController } from "./phases.controller";
import { PhasesService } from "./phases.service";

@Module({
  imports: [AuthModule, PlayersModule],
  controllers: [PhasesController],
  providers: [PhasesService],
})
export class PhasesModule {}
