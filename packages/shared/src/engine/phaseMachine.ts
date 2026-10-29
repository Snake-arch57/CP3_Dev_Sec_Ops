import type { Day } from "../schemas/phase.schema";
import type { Email, InvestigationToolId, PlayerAction } from "../schemas/email.schema";
import { scoreEmailAttempt, type EmailAttemptResult } from "./scoring";
import { ferramentaVisivel } from "./gameConfig";

/**
 * Máquina de estados de um dia de jogo.
 *
 * Simplificada a pedido da empresa. O que saiu, e por quê:
 *
 *  - **Cronômetro que encerra o dia.** Ao zerar, a fase terminava e os e-mails
 *    restantes eram perdidos. Pressa é justamente o que o golpista explora; um
 *    treinamento que pune quem vai com calma treina o reflexo errado.
 *  - **Custo de tempo por ferramenta.** Consequência direta do item acima.
 *  - **Eventos aleatórios** (pop-up do chefe, enxurrada de e-mails, "lag").
 *    Existiam para roubar tempo, e sem cronômetro não têm o que roubar.
 *  - **Combo e barra de segurança.** Mais dois números para acompanhar enquanto
 *    se tenta ler um e-mail.
 *
 * O tempo continua sendo *medido* (`TICK` acumula `secondsElapsed`), porque o
 * resultado da fase é gravado com ele. Só deixou de ser *limite*.
 */

export interface PhaseTotals {
  correctCount: number;
  wrongCount: number;
  totalScore: number;
  xpEarned: number;
  moneyEarned: number;
  timeUsedSeconds: number;
  /**
   * Sempre 0. O combo foi removido, mas a API e a tabela `PhaseResult` exigem
   * o campo. Mantido para não arrastar migração de banco junto com a
   * simplificação; pode sair numa limpeza posterior do contrato.
   */
  bestCombo: number;
}

export interface PlayingState {
  status: "playing";
  day: Day;
  emails: Email[];
  currentEmailIndex: number;
  secondsElapsed: number;
  toolsUsedThisEmail: InvestigationToolId[];
  score: number;
  money: number;
  xp: number;
  results: EmailAttemptResult[];
}

export type PhaseState =
  | { status: "intro"; day: Day; emails: Email[] }
  | PlayingState
  | { status: "paused"; previous: PlayingState }
  | { status: "phase_summary"; day: Day; results: EmailAttemptResult[]; totals: PhaseTotals }
  | { status: "phase_complete"; day: Day; totals: PhaseTotals };

export type PhaseAction =
  | { type: "START" }
  | { type: "TICK"; deltaSeconds: number }
  | { type: "USE_TOOL"; toolId: InvestigationToolId }
  | { type: "DECIDE"; action: PlayerAction }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "FINISH_PHASE" };

export function createIntroState(day: Day, emails: Email[]): PhaseState {
  return { status: "intro", day, emails };
}

function buildTotals(results: EmailAttemptResult[], timeUsedSeconds: number): PhaseTotals {
  return {
    correctCount: results.filter((r) => r.correct).length,
    wrongCount: results.filter((r) => !r.correct).length,
    totalScore: results.reduce((sum, r) => sum + r.finalScore, 0),
    xpEarned: results.reduce((sum, r) => sum + r.xpEarned, 0),
    moneyEarned: results.reduce((sum, r) => sum + r.moneyEarned, 0),
    timeUsedSeconds: Math.round(timeUsedSeconds),
    bestCombo: 0,
  };
}

export function phaseReducer(state: PhaseState, action: PhaseAction): PhaseState {
  switch (action.type) {
    case "START": {
      if (state.status !== "intro") return state;
      return {
        status: "playing",
        day: state.day,
        emails: state.emails,
        currentEmailIndex: 0,
        secondsElapsed: 0,
        toolsUsedThisEmail: [],
        score: 0,
        money: 0,
        xp: 0,
        results: [],
      };
    }

    case "TICK": {
      if (state.status !== "playing") return state;
      // Só mede. Nunca encerra a fase.
      return { ...state, secondsElapsed: state.secondsElapsed + action.deltaSeconds };
    }

    case "USE_TOOL": {
      if (state.status !== "playing") return state;
      // Ferramenta fora de cena não é registrada, mesmo que alguém dispare a
      // ação por outro caminho: o jogo não deve contar pista que não mostrou.
      if (!ferramentaVisivel(action.toolId)) return state;
      if (state.toolsUsedThisEmail.includes(action.toolId)) return state;
      return { ...state, toolsUsedThisEmail: [...state.toolsUsedThisEmail, action.toolId] };
    }

    case "DECIDE": {
      if (state.status !== "playing") return state;
      const currentEmail = state.emails[state.currentEmailIndex];
      if (!currentEmail) return state;

      const attempt = scoreEmailAttempt({ email: currentEmail, playerAction: action.action });
      const results = [...state.results, attempt];
      const nextIndex = state.currentEmailIndex + 1;

      if (nextIndex >= state.emails.length) {
        return {
          status: "phase_summary",
          day: state.day,
          results,
          totals: buildTotals(results, state.secondsElapsed),
        };
      }

      return {
        ...state,
        score: state.score + attempt.finalScore,
        money: state.money + attempt.moneyEarned,
        xp: state.xp + attempt.xpEarned,
        results,
        currentEmailIndex: nextIndex,
        toolsUsedThisEmail: [],
      };
    }

    case "PAUSE": {
      if (state.status !== "playing") return state;
      return { status: "paused", previous: state };
    }

    case "RESUME": {
      if (state.status !== "paused") return state;
      return state.previous;
    }

    case "FINISH_PHASE": {
      if (state.status !== "phase_summary") return state;
      return { status: "phase_complete", day: state.day, totals: state.totals };
    }

    default:
      return state;
  }
}
