import type { Achievement } from "../schemas/achievement.schema";
import type { PlayerProfile } from "../schemas/player-profile.schema";

function isAchievementMet(achievement: Achievement, profile: PlayerProfile): boolean {
  const { criteria } = achievement;
  switch (criteria.kind) {
    case "perfect_emails_total": {
      const total = profile.phaseHistory.reduce((sum, r) => sum + r.correctCount, 0);
      return total >= criteria.count;
    }
    case "concept_mastered": {
      const total = profile.phaseHistory.reduce(
        (sum, r) => sum + (r.conceptCorrectCounts[criteria.concept] ?? 0),
        0,
      );
      return total >= criteria.correctCount;
    }
    case "day_completed_no_errors": {
      return profile.phaseHistory.some((r) => r.dayId === criteria.dayId && r.wrongCount === 0);
    }
    case "phases_completed": {
      return profile.completedDayIds.length >= criteria.count;
    }
  }
}

export function evaluateAchievements(
  profile: PlayerProfile,
  achievements: Achievement[],
): { profile: PlayerProfile; newlyUnlocked: Achievement[] } {
  const newlyUnlocked = achievements.filter(
    (a) => !profile.unlockedAchievementIds.includes(a.id) && isAchievementMet(a, profile),
  );

  if (newlyUnlocked.length === 0) {
    return { profile, newlyUnlocked: [] };
  }

  const updatedProfile: PlayerProfile = {
    ...profile,
    unlockedAchievementIds: [...profile.unlockedAchievementIds, ...newlyUnlocked.map((a) => a.id)],
    xp: profile.xp + newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0),
    money: profile.money + newlyUnlocked.reduce((sum, a) => sum + a.moneyReward, 0),
  };

  return { profile: updatedProfile, newlyUnlocked };
}
