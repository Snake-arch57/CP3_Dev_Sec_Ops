/**
 * Pontuação dos minijogos.
 *
 * Mesma simplificação do jogo principal: acertou ganha, errou não perde. Sem
 * cronômetro, sem bônus por velocidade, sem combo.
 *
 * O quiz premiava responder rápido (6 pontos por segundo restante), e o
 * caça-phishing tirava 25 pontos por erro dentro de um relógio de 75 segundos.
 * Os dois recompensavam a reação por impulso — que é o que faz alguém clicar
 * num link falso. Tirar o tempo não deixou os jogos mais fáceis de acertar; só
 * parou de premiar a pressa.
 */

export const ARCADE_CONFIG = {
  correctPoints: 40,
} as const;

export interface ArcadeHitResult {
  correct: boolean;
  points: number;
}

export function scoreArcadeHit(isCorrectHit: boolean): ArcadeHitResult {
  return isCorrectHit
    ? { correct: true, points: ARCADE_CONFIG.correctPoints }
    : { correct: false, points: 0 };
}

export const QUIZ_CONFIG = {
  basePoints: 100,
} as const;

export interface QuizAnswerResult {
  correct: boolean;
  points: number;
}

export function scoreQuizAnswer(correct: boolean): QuizAnswerResult {
  return correct
    ? { correct: true, points: QUIZ_CONFIG.basePoints }
    : { correct: false, points: 0 };
}
