"use client";

import { useEffect, useRef } from "react";
import type { PhaseAction } from "@repo/shared/engine";

export function useGameTimer(isRunning: boolean, dispatch: (action: PhaseAction) => void) {
  const lastTimestampRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      lastTimestampRef.current = null;
      return;
    }

    function tick(timestamp: number) {
      if (lastTimestampRef.current !== null) {
        const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
        dispatch({ type: "TICK", deltaSeconds });
      }
      lastTimestampRef.current = timestamp;
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      lastTimestampRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);
}
