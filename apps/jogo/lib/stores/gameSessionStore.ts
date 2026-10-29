import { create } from "zustand";
import { createIntroState, phaseReducer, type PhaseAction, type PhaseState } from "@repo/shared/engine";
import type { Day, Email } from "@repo/shared/schemas";

interface GameSessionStore {
  state: PhaseState | null;
  initPhase: (day: Day, emails: Email[]) => void;
  dispatch: (action: PhaseAction) => void;
  reset: () => void;
}

export const useGameSessionStore = create<GameSessionStore>((set, get) => ({
  state: null,
  initPhase: (day, emails) => set({ state: createIntroState(day, emails) }),
  dispatch: (action) => {
    const current = get().state;
    if (!current) return;
    set({ state: phaseReducer(current, action) });
  },
  reset: () => set({ state: null }),
}));
