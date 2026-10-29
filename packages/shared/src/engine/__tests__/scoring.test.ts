import { describe, expect, it } from "vitest";
import { scoreEmailAttempt } from "../scoring";
import { GAME_CONFIG } from "../gameConfig";
import { phaseReducer, type PlayingState } from "../phaseMachine";
import { makeDay, makeEmail } from "./fixtures";

describe("scoreEmailAttempt", () => {
  it("dá os pontos da dificuldade ao acertar", () => {
    const email = makeEmail({ difficulty: 2, correctAction: "delete", riskLevel: "malicious" });
    const r = scoreEmailAttempt({ email, playerAction: "delete" });

    expect(r.correct).toBe(true);
    expect(r.finalScore).toBe(GAME_CONFIG.basePointsByDifficulty(2));
    expect(r.xpEarned).toBe(r.finalScore);
    expect(r.moneyEarned).toBe(Math.round(r.finalScore * GAME_CONFIG.moneyConversionRate));
  });

  it("não tira pontos ao errar — quem erra já recebe a explicação", () => {
    const email = makeEmail({ difficulty: 2, correctAction: "report", riskLevel: "malicious" });
    const r = scoreEmailAttempt({ email, playerAction: "accept" });

    expect(r).toEqual({ correct: false, finalScore: 0, xpEarned: 0, moneyEarned: 0 });
  });
});

/**
 * O teste que mais importa neste arquivo.
 *
 * A versão anterior tinha um teste chamado "reduz a pontuação quanto mais
 * ferramentas de investigação forem usadas" — a regra que fazia a estratégia
 * vencedora ser decidir sem conferir nada. Este garante o contrário, pelo
 * caminho completo da máquina de fases: quem investiga tudo antes de decidir
 * pontua exatamente o mesmo que quem não investiga.
 */
describe("investigar é livre", () => {
  function jogarUmEmail(ferramentas: Parameters<typeof phaseReducer>[1][]) {
    const email = makeEmail({
      difficulty: 2,
      correctAction: "delete",
      riskLevel: "malicious",
      investigationHints: [
        { toolId: "sender_address", revealsField: "sender.domain", summaryText: "a" },
        { toolId: "link_hover", revealsField: "links", summaryText: "b" },
        { toolId: "internal_db_lookup", revealsField: "sender", summaryText: "c" },
      ],
    });
    let s = phaseReducer({ status: "intro", day: makeDay(), emails: [email] }, { type: "START" });
    for (const a of ferramentas) s = phaseReducer(s, a);
    return phaseReducer(s, { type: "DECIDE", action: "delete" });
  }

  it("usar todas as ferramentas não custa pontos", () => {
    const semInvestigar = jogarUmEmail([]);
    const investigandoTudo = jogarUmEmail([
      { type: "USE_TOOL", toolId: "sender_address" },
      { type: "USE_TOOL", toolId: "link_hover" },
      { type: "USE_TOOL", toolId: "internal_db_lookup" },
    ]);

    expect(semInvestigar.status).toBe("phase_summary");
    expect(investigandoTudo.status).toBe("phase_summary");
    if (semInvestigar.status !== "phase_summary" || investigandoTudo.status !== "phase_summary") return;

    expect(investigandoTudo.totals.totalScore).toBe(semInvestigar.totals.totalScore);
    expect(investigandoTudo.totals.totalScore).toBeGreaterThan(0);
  });

  it("não aceita registrar ferramenta que saiu de cena", () => {
    const email = makeEmail({
      investigationHints: [
        { toolId: "sender_address", revealsField: "sender.domain", summaryText: "a" },
        { toolId: "header_inspect", revealsField: "headers", summaryText: "b" },
      ],
    });
    let s = phaseReducer({ status: "intro", day: makeDay(), emails: [email] }, { type: "START" });
    s = phaseReducer(s, { type: "USE_TOOL", toolId: "header_inspect" });

    expect((s as PlayingState).toolsUsedThisEmail).toEqual([]);
  });
});
