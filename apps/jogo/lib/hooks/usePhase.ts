"use client";

import { useEffect } from "react";
import { getDayById } from "@repo/shared/content";
import type { PhaseState } from "@repo/shared/engine";
import type { Locale } from "@/lib/i18n/locale";
import { useGameSessionStore } from "@/lib/stores/gameSessionStore";
import { embaralhar } from "@/lib/utils";

function currentStateDayId(state: PhaseState | null): string | undefined {
  if (!state) return undefined;
  return state.status === "paused" ? state.previous.day.id : state.day.id;
}

export function usePhase(dayId: string, locale?: Locale) {
  const loaded = getDayById(dayId, locale);
  const state = useGameSessionStore((s) => s.state);
  const initPhase = useGameSessionStore((s) => s.initPhase);
  const dispatch = useGameSessionStore((s) => s.dispatch);

  useEffect(() => {
    if (!loaded) return;
    if (currentStateDayId(state) !== dayId) {
      // Ordem sorteada a cada partida: os 4 e-mails do dia são os mesmos,
      // mas ninguém recebe na mesma sequência do colega.
      initPhase(loaded.day, embaralhar(loaded.emails));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId]);

  return { day: loaded?.day, state, dispatch, notFound: !loaded };
}
