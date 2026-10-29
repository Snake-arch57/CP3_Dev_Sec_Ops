import { describe, expect, it } from "vitest";
import { createIntroState, phaseReducer, type PlayingState } from "../phaseMachine";
import { makeDay, makeEmail } from "./fixtures";

function startPlaying(emails = [makeEmail({ id: "e1", correctAction: "report", difficulty: 2 })]) {
  const day = makeDay({ timeLimitSeconds: 60 }, emails.map((e) => e.id));
  const playing = phaseReducer(createIntroState(day, emails), { type: "START" });
  if (playing.status !== "playing") throw new Error("expected playing state");
  return playing;
}

describe("phaseReducer", () => {
  it("transiciona de intro para playing ao START, com o relógio zerado", () => {
    const playing = startPlaying();
    expect(playing.status).toBe("playing");
    expect(playing.secondsElapsed).toBe(0);
    expect(playing.currentEmailIndex).toBe(0);
  });

  it("TICK só mede o tempo: nunca encerra a fase, nem passando do limite do dia", () => {
    const playing = startPlaying();
    // 60 é o limite do dia no fixture; antes disto a fase acabava e perdia os e-mails.
    const depois = phaseReducer(playing, { type: "TICK", deltaSeconds: 600 });

    expect(depois.status).toBe("playing");
    expect((depois as PlayingState).secondsElapsed).toBe(600);
  });

  it("USE_TOOL registra a ferramenta uma única vez, sem custar tempo", () => {
    const playing = startPlaying();
    const once = phaseReducer(playing, { type: "USE_TOOL", toolId: "sender_address" }) as PlayingState;
    const twice = phaseReducer(once, { type: "USE_TOOL", toolId: "sender_address" }) as PlayingState;

    expect(twice.toolsUsedThisEmail).toEqual(["sender_address"]);
    expect(twice.secondsElapsed).toBe(playing.secondsElapsed);
  });

  it("DECIDE correto pontua e avança para o próximo e-mail", () => {
    const playing = startPlaying([
      makeEmail({ id: "e1", correctAction: "report", difficulty: 2 }),
      makeEmail({ id: "e2", correctAction: "accept", difficulty: 1 }),
    ]);
    const next = phaseReducer(playing, { type: "DECIDE", action: "report" }) as PlayingState;

    expect(next.currentEmailIndex).toBe(1);
    expect(next.score).toBe(200);
    expect(next.toolsUsedThisEmail).toEqual([]);
  });

  it("DECIDE errado não pontua, mas também não tira pontos já ganhos", () => {
    const playing = startPlaying([
      makeEmail({ id: "e1", correctAction: "report", difficulty: 2 }),
      makeEmail({ id: "e2", correctAction: "accept", difficulty: 1 }),
      makeEmail({ id: "e3", correctAction: "accept", difficulty: 1 }),
    ]);
    const acertou = phaseReducer(playing, { type: "DECIDE", action: "report" }) as PlayingState;
    const errou = phaseReducer(acertou, { type: "DECIDE", action: "delete" }) as PlayingState;

    expect(errou.score).toBe(acertou.score);
    expect(errou.results.at(-1)?.correct).toBe(false);
  });

  it("DECIDE no último e-mail vai para o resumo com os totais e o tempo medido", () => {
    const playing = startPlaying();
    const ticked = phaseReducer(playing, { type: "TICK", deltaSeconds: 12 });
    const summary = phaseReducer(ticked, { type: "DECIDE", action: "report" });

    expect(summary.status).toBe("phase_summary");
    if (summary.status !== "phase_summary") return;
    expect(summary.totals).toEqual({
      correctCount: 1,
      wrongCount: 0,
      totalScore: 200,
      xpEarned: 200,
      moneyEarned: 100,
      timeUsedSeconds: 12,
      bestCombo: 0,
    });
  });

  it("PAUSE/RESUME preservam o estado da fase em andamento", () => {
    const playing = startPlaying();
    const ticked = phaseReducer(playing, { type: "TICK", deltaSeconds: 5 }) as PlayingState;
    const paused = phaseReducer(ticked, { type: "PAUSE" });
    expect(paused.status).toBe("paused");
    expect(phaseReducer(paused, { type: "RESUME" })).toEqual(ticked);
  });
});
