import { describe, expect, it } from "vitest";
import { ARCADE_CONFIG, QUIZ_CONFIG, scoreArcadeHit, scoreQuizAnswer } from "../minigames";

describe("scoreArcadeHit", () => {
  it("dá os pontos fixos num acerto", () => {
    expect(scoreArcadeHit(true)).toEqual({ correct: true, points: ARCADE_CONFIG.correctPoints });
  });

  it("não tira pontos num erro", () => {
    expect(scoreArcadeHit(false)).toEqual({ correct: false, points: 0 });
  });

  it("vale o mesmo no primeiro e no décimo acerto — não há mais combo", () => {
    const acertos = Array.from({ length: 10 }, () => scoreArcadeHit(true).points);
    expect(new Set(acertos).size).toBe(1);
  });
});

describe("scoreQuizAnswer", () => {
  it("dá os pontos fixos numa resposta certa", () => {
    expect(scoreQuizAnswer(true)).toEqual({ correct: true, points: QUIZ_CONFIG.basePoints });
  });

  it("não pontua numa resposta errada", () => {
    expect(scoreQuizAnswer(false)).toEqual({ correct: false, points: 0 });
  });
});
