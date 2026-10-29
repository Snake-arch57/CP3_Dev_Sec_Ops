import type { InvestigationToolId } from "../schemas/email.schema";

export const GAME_CONFIG = {
  basePointsByDifficulty: (difficulty: number) => 100 * difficulty,
  xpConversionRate: 1,
  moneyConversionRate: 0.5,
} as const;

/**
 * Ferramentas que o jogador vê na bancada de investigação.
 *
 * Eram onze. Cinco saíram de cena na simplificação pedida pela empresa, e o
 * critério foi um só: **se a pista exige vocabulário de analista de segurança
 * para ser entendida, ela não serve para quem trabalha na loja.**
 *
 * Saíram:
 *  - `header_inspect`     — mostrava SPF, DKIM e DMARC. Era a origem da maior
 *                           parte do jargão do jogo (mais de 50 menções cada).
 *  - `sandbox_execution`  — "abrir o anexo num ambiente isolado" pressupõe
 *                           saber o que é isolamento.
 *  - `certificate_view`   — emissor de certificado não é algo que se confere
 *                           no dia a dia de trabalho.
 *  - `domain_inspect`     — a pista de domínio parecido já aparece no próprio
 *                           endereço do remetente; ter duas ferramentas para a
 *                           mesma coisa só confundia.
 *  - `ai_assistant`       — uma "IA corporativa" que às vezes erra ensina a
 *                           terceirizar o julgamento, e acrescenta uma camada
 *                           de desconfiança sobre a própria ferramenta.
 *
 * Os dados continuam no conteúdo dos e-mails (o schema não mudou). Eles só não
 * são mais oferecidos — o que permite reverter esta lista sem reescrever os
 * dias. Os testes de conteúdo garantem que todo e-mail ainda tenha ao menos uma
 * pista visível.
 */
export const FERRAMENTAS_VISIVEIS: readonly InvestigationToolId[] = [
  "sender_address",
  "link_hover",
  "attachment_analysis",
  "qr_preview",
  "internal_db_lookup",
  "out_of_band_verify",
] as const;

export function ferramentaVisivel(toolId: InvestigationToolId): boolean {
  return FERRAMENTAS_VISIVEIS.includes(toolId);
}

const XP_PER_LEVEL = 1000;

export function levelForXp(xp: number): number {
  return 1 + Math.floor(xp / XP_PER_LEVEL);
}

export function xpIntoCurrentLevel(xp: number): { current: number; required: number } {
  return { current: xp % XP_PER_LEVEL, required: XP_PER_LEVEL };
}
