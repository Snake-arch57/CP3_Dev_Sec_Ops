import { api } from "./client";
import type { PlayerProfile } from "./types";

export const upgradesApi = {
  purchase: (upgradeId: string) => api.post<PlayerProfile>("/upgrades/purchase", { upgradeId }),
};
