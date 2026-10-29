import type { Email, InvestigationHint, InvestigationToolId } from "../schemas/email.schema";
import { ferramentaVisivel } from "./gameConfig";

export interface RevealedInvestigation {
  hint: InvestigationHint;
  value: unknown;
}

/**
 * Resolves a dot-path like "attachments[0].fileName" against an email object.
 * Supports array indices in brackets. Returns undefined if the path doesn't resolve.
 */
export function resolveFieldPath(source: unknown, path: string): unknown {
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  return segments.reduce<unknown>((acc, segment) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[segment];
  }, source);
}

export function getInvestigationHint(
  email: Email,
  toolId: InvestigationToolId,
): InvestigationHint | undefined {
  return email.investigationHints.find((hint) => hint.toolId === toolId);
}

export function revealInvestigation(
  email: Email,
  toolId: InvestigationToolId,
): RevealedInvestigation | undefined {
  const hint = getInvestigationHint(email, toolId);
  if (!hint) return undefined;
  return { hint, value: resolveFieldPath(email, hint.revealsField) };
}

/**
 * Ferramentas oferecidas para este e-mail: as que têm pista E estão em cena.
 *
 * O filtro mora aqui, e não só na interface, para que a regra valha em qualquer
 * lugar que pergunte "o que dá para investigar neste e-mail" — inclusive nos
 * testes de conteúdo, que usam esta mesma função para garantir que nenhum
 * e-mail fique sem pista visível.
 */
export function availableToolIds(email: Email): InvestigationToolId[] {
  return email.investigationHints.map((hint) => hint.toolId).filter(ferramentaVisivel);
}
