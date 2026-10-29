import { api, ApiError } from "./client";
import type { PlayerProfile } from "./types";

export const playersApi = {
  async me(): Promise<PlayerProfile | null> {
    try {
      return await api.get<PlayerProfile>("/players/me");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  },
};
