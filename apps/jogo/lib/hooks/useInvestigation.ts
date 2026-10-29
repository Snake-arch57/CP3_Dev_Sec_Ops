"use client";

import { revealInvestigation } from "@repo/shared/engine";
import type { Email, InvestigationToolId, PlayerAction } from "@repo/shared/schemas";
import { useGameSessionStore } from "@/lib/stores/gameSessionStore";

export function useInvestigation(email: Email) {
  const dispatch = useGameSessionStore((s) => s.dispatch);
  const toolsUsed = useGameSessionStore((s) =>
    s.state?.status === "playing" ? s.state.toolsUsedThisEmail : [],
  );

  function runTool(toolId: InvestigationToolId) {
    dispatch({ type: "USE_TOOL", toolId });
  }

  function decide(action: PlayerAction) {
    dispatch({ type: "DECIDE", action });
  }

  function getRevealed(toolId: InvestigationToolId) {
    if (!toolsUsed.includes(toolId)) return undefined;
    return revealInvestigation(email, toolId);
  }

  return { toolsUsed, runTool, decide, getRevealed };
}
