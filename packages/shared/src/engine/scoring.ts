import type { Email, PlayerAction } from "../schemas/email.schema";
import { GAME_CONFIG } from "./gameConfig";

/**
 * Pontuação de um e-mail: acertou ganha, errou não ganha.
 *
 * A versão anterior tinha penalidade por segundo investigado, bônus de
 * velocidade que decaía com o tempo e multiplicador de combo. Somadas, essas
 * regras produziam um efeito que ninguém tinha planejado: **a estratégia que
 * mais pontuava era decidir sem investigar nada**. Usar ferramenta custava
 * ponto, e não usar nenhuma dava o bônus máximo. Havia inclusive um teste
 * garantindo que a pontuação caísse conforme a pessoa checava mais pistas.
 *
 * Num treinamento de segurança, isso ensina o oposto do objetivo — o
 * comportamento que se quer é justamente parar e conferir antes de clicar.
 *
 * Ao simplificar a pedido da empresa ("jogos bem mais simples"), a regra passou
 * a ser a única que cabe numa frase e não pune a cautela. Investigar é livre.
 */

export interface EmailAttemptInput {
  email: Pick<Email, "difficulty" | "correctAction">;
  playerAction: PlayerAction;
}

export interface EmailAttemptResult {
  correct: boolean;
  finalScore: number;
  xpEarned: number;
  moneyEarned: number;
}

export function scoreEmailAttempt(input: EmailAttemptInput): EmailAttemptResult {
  const { email, playerAction } = input;
  const correct = playerAction === email.correctAction;

  if (!correct) {
    // Errar não tira pontos. Quem erra já recebe a explicação do porquê; somar
    // punição a isso só desestimula tentar de novo.
    return { correct: false, finalScore: 0, xpEarned: 0, moneyEarned: 0 };
  }

  const finalScore = GAME_CONFIG.basePointsByDifficulty(email.difficulty);

  return {
    correct: true,
    finalScore,
    xpEarned: Math.round(finalScore * GAME_CONFIG.xpConversionRate),
    moneyEarned: Math.round(finalScore * GAME_CONFIG.moneyConversionRate),
  };
}
