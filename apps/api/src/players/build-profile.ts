import { levelForXp } from "@repo/shared/engine";
import type { PrismaService } from "../prisma/prisma.service";

export async function buildPlayerProfile(prisma: PrismaService, userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      ownedUpgrades: true,
      unlockedAchievements: true,
      phaseResults: { orderBy: { completedAt: "asc" } },
    },
  });

  const completedDayIds = [...new Set(user.phaseResults.map((r) => r.dayId))];

  return {
    schemaVersion: 1 as const,
    id: user.id,
    username: user.username,
    email: user.email,
    playerName: user.displayName,
    department: user.department,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    level: levelForXp(user.xp),
    xp: user.xp,
    money: user.money,
    reputation: user.reputation,
    ownedUpgradeIds: user.ownedUpgrades.map((u) => u.upgradeId),
    unlockedAchievementIds: user.unlockedAchievements.map((a) => a.achievementId),
    completedDayIds,
    phaseHistory: user.phaseResults.map((r) => ({
      dayId: r.dayId,
      completedAt: r.completedAt.toISOString(),
      correctCount: r.correctCount,
      wrongCount: r.wrongCount,
      totalScore: r.totalScore,
      xpEarned: r.xpEarned,
      moneyEarned: r.moneyEarned,
      timeUsedSeconds: r.timeUsedSeconds,
      bestCombo: r.bestCombo,
      conceptCorrectCounts: r.conceptCorrectCounts as Record<string, number>,
    })),
  };
}
