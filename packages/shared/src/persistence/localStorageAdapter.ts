import { PlayerProfileSchema, type PlayerProfile, type PhaseResultSummary } from "../schemas/player-profile.schema";
import { createDefaultPlayerProfile } from "../schemas/player-profile.schema";
import { levelForXp } from "../engine/gameConfig";
import { evaluateAchievements } from "../engine/achievements";
import { ACHIEVEMENTS } from "../content/loader";
import type { PlayerProfileRepository, SavePhaseResultOutcome } from "./playerProfileRepository";

const STORAGE_KEY = "leroy-cyber:player-profile:v1";

/**
 * Older/malformed payloads fall back to a fresh profile rather than crashing
 * the app. Bump STORAGE_KEY's version suffix on breaking schema changes.
 */
function migratePlayerProfile(raw: unknown): PlayerProfile {
  const parsed = PlayerProfileSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  return createDefaultPlayerProfile("Jogador");
}

export class LocalStoragePlayerProfileRepository implements PlayerProfileRepository {
  async load(): Promise<PlayerProfile | null> {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return migratePlayerProfile(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async save(profile: PlayerProfile): Promise<void> {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  async savePhaseResult(result: PhaseResultSummary): Promise<SavePhaseResultOutcome> {
    const existing = (await this.load()) ?? createDefaultPlayerProfile("Jogador");
    const xp = existing.xp + result.xpEarned;
    const updated: PlayerProfile = {
      ...existing,
      xp,
      level: levelForXp(xp),
      money: existing.money + result.moneyEarned,
      completedDayIds: existing.completedDayIds.includes(result.dayId)
        ? existing.completedDayIds
        : [...existing.completedDayIds, result.dayId],
      phaseHistory: [...existing.phaseHistory, result],
    };

    const { profile: finalProfile, newlyUnlocked } = evaluateAchievements(updated, ACHIEVEMENTS);
    await this.save(finalProfile);
    return { profile: finalProfile, newlyUnlocked };
  }
}
