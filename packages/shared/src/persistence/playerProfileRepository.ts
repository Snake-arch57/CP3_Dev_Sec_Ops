import type { PlayerProfile, PhaseResultSummary } from "../schemas/player-profile.schema";
import type { Achievement } from "../schemas/achievement.schema";

export interface SavePhaseResultOutcome {
  profile: PlayerProfile;
  newlyUnlocked: Achievement[];
}

export interface PlayerProfileRepository {
  load(): Promise<PlayerProfile | null>;
  save(profile: PlayerProfile): Promise<void>;
  savePhaseResult(result: PhaseResultSummary): Promise<SavePhaseResultOutcome>;
}
