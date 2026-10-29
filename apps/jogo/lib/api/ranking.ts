import { api } from "./client";
import type { RankingResponse } from "./types";

export const rankingApi = {
  get: () => api.get<RankingResponse>("/ranking"),
};
