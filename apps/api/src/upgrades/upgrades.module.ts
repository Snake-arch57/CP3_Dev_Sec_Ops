import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PlayersModule } from "../players/players.module";
import { UpgradesController } from "./upgrades.controller";
import { UpgradesService } from "./upgrades.service";

@Module({
  imports: [AuthModule, PlayersModule],
  controllers: [UpgradesController],
  providers: [UpgradesService],
})
export class UpgradesModule {}
