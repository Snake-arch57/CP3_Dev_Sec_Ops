import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Embaralha uma lista, sem alterar a original (Fisher-Yates).
 *
 * Usado para que dois alunos lado a lado não vejam a mesma ordem, nem na caixa
 * de e-mails, nem no quiz, nem no caça-golpe — colar do vizinho deixa de ser
 * um atalho, e repetir a fase deixa de ser decorar posição.
 */
export function embaralhar<T>(arr: readonly T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}
