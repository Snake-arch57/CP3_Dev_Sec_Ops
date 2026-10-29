import { z } from "zod";

export const PhaseResultSummarySchema = z.object({
  dayId: z.string(),
  completedAt: z.string(),
  correctCount: z.number().int().nonnegative(),
  wrongCount: z.number().int().nonnegative(),
  totalScore: z.number().int(),
  xpEarned: z.number().int().nonnegative(),
  moneyEarned: z.number().int().nonnegative(),
  timeUsedSeconds: z.number().nonnegative(),
  bestCombo: z.number().int().nonnegative(),
  conceptCorrectCounts: z.record(z.string(), z.number().int().nonnegative()).default({}),
});
export type PhaseResultSummary = z.infer<typeof PhaseResultSummarySchema>;

export const PlayerProfileSchema = z.object({
  schemaVersion: z.literal(1),
  playerName: z.string(),
  level: z.number().int().positive().default(1),
  xp: z.number().int().nonnegative().default(0),
  money: z.number().int().nonnegative().default(0),
  reputation: z.number().int().min(0).max(100).default(100),
  ownedUpgradeIds: z.array(z.string()).default([]),
  unlockedAchievementIds: z.array(z.string()).default([]),
  completedDayIds: z.array(z.string()).default([]),
  phaseHistory: z.array(PhaseResultSummarySchema).default([]),
});
export type PlayerProfile = z.infer<typeof PlayerProfileSchema>;

export function createDefaultPlayerProfile(playerName: string): PlayerProfile {
  return {
    schemaVersion: 1,
    playerName,
    level: 1,
    xp: 0,
    money: 0,
    reputation: 100,
    ownedUpgradeIds: [],
    unlockedAchievementIds: [],
    completedDayIds: [],
    phaseHistory: [],
  };
}
