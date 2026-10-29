import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { PlayersModule } from "./players/players.module";
import { PhasesModule } from "./phases/phases.module";
import { UpgradesModule } from "./upgrades/upgrades.module";
import { RankingModule } from "./ranking/ranking.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    PlayersModule,
    PhasesModule,
    UpgradesModule,
    RankingModule,
  ],
})
export class AppModule {}
