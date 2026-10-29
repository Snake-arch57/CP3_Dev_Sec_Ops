import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PlayersService } from "../players/players.service";
import { evaluateAchievements } from "@repo/shared/engine";
import { ACHIEVEMENTS, getDayById } from "@repo/shared/content";
import type { SavePhaseResultDto } from "./dto";

@Injectable()
export class PhasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async saveResult(userId: string, dto: SavePhaseResultDto) {
    // Fases da história (dia 1, 2, 3...) só rendem XP/dinheiro na primeira vez —
    // do contrário dava para "farmar" pontos jogando a mesma fase repetidamente.
    // Minigames de arcade usam dayIds sintéticos que não batem com nenhum dia real,
    // então continuam podendo ser jogados (e pontuados) quantas vezes o jogador quiser.
    const isStoryDay = getDayById(dto.dayId) !== undefined;
    const alreadyCompleted =
      isStoryDay &&
      (await this.prisma.phaseResult.findFirst({ where: { userId, dayId: dto.dayId } })) !== null;

    const xpToAward = alreadyCompleted ? 0 : dto.xpEarned;
    const moneyToAward = alreadyCompleted ? 0 : dto.moneyEarned;

    await this.prisma.$transaction([
      this.prisma.phaseResult.create({
        data: {
          userId,
          dayId: dto.dayId,
          correctCount: dto.correctCount,
          wrongCount: dto.wrongCount,
          totalScore: dto.totalScore,
          xpEarned: xpToAward,
          moneyEarned: moneyToAward,
          timeUsedSeconds: dto.timeUsedSeconds,
          bestCombo: dto.bestCombo,
          conceptCorrectCounts: dto.conceptCorrectCounts,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xpToAward },
          money: { increment: moneyToAward },
        },
      }),
    ]);

    const profile = await this.playersService.getProfile(userId);
    const { newlyUnlocked } = evaluateAchievements(profile, ACHIEVEMENTS);

    if (newlyUnlocked.length > 0) {
      const bonusXp = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0);
      const bonusMoney = newlyUnlocked.reduce((sum, a) => sum + a.moneyReward, 0);
      await this.prisma.$transaction([
        ...newlyUnlocked.map((achievement) =>
          this.prisma.unlockedAchievement.create({
            data: { userId, achievementId: achievement.id },
          }),
        ),
        this.prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: bonusXp }, money: { increment: bonusMoney } },
        }),
      ]);
    }

    return {
      profile: await this.playersService.getProfile(userId),
      newlyUnlocked,
      alreadyCompleted,
      xpAwarded: xpToAward,
      moneyAwarded: moneyToAward,
    };
  }
}
