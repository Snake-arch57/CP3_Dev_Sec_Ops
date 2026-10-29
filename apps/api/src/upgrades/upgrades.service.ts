import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PlayersService } from "../players/players.service";
import { UPGRADES } from "@repo/shared/content";

@Injectable()
export class UpgradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async purchase(userId: string, upgradeId: string) {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) throw new NotFoundException("Upgrade não encontrado.");

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const alreadyOwned = await this.prisma.ownedUpgrade.findUnique({
      where: { userId_upgradeId: { userId, upgradeId } },
    });
    if (alreadyOwned) return this.playersService.getProfile(userId);

    if (user.money < upgrade.priceMoney) {
      throw new BadRequestException("Dinheiro insuficiente.");
    }

    await this.prisma.$transaction([
      this.prisma.ownedUpgrade.create({ data: { userId, upgradeId } }),
      this.prisma.user.update({
        where: { id: userId },
        data: { money: { decrement: upgrade.priceMoney } },
      }),
    ]);

    return this.playersService.getProfile(userId);
  }
}
