import { api } from "./client";
import type { PhaseResultSummary } from "@repo/shared/schemas";
import type { SavePhaseResultResponse } from "./types";

export type SavePhaseResultPayload = Omit<PhaseResultSummary, "completedAt">;

export const phasesApi = {
  saveResult: (payload: SavePhaseResultPayload) =>
    api.post<SavePhaseResultResponse>("/phases/results", payload),
};
