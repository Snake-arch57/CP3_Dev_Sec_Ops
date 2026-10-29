"use client";

import { useState } from "react";

/**
 * Sorteador de palavra-código para combinar com a família.
 *
 * Palavras concretas e sem relação entre si de propósito: a combinação
 * precisa ser fácil de lembrar sob estresse e impossível de adivinhar por
 * quem leu as redes sociais da pessoa. Nada de nome de bicho de estimação,
 * time ou cidade natal — é justamente o que um golpista já sabe.
 *
 * Sorteio local, nada é enviado nem gravado.
 */

const PRIMEIRA = [
  "abacaxi", "âncora", "bússola", "cadeira", "cebola", "chaleira", "escada",
  "farol", "girassol", "goiaba", "janela", "lanterna", "melancia", "moringa",
  "novelo", "peneira", "pirulito", "regador", "sanfona", "telhado", "tijolo",
  "vassoura", "violão", "zabumba",
];

const SEGUNDA = [
  "amarelo", "azedo", "comprido", "descalço", "enferrujado", "gelado",
  "listrado", "molhado", "quadrado", "quieto", "redondo", "torto", "veloz",
  "vazio",
];

/** Sorteio com a fonte criptográfica do navegador, não com Math.random. */
function sortear() {
  const n = new Uint32Array(2);
  crypto.getRandomValues(n);
  return `${PRIMEIRA[n[0] % PRIMEIRA.length]} ${SEGUNDA[n[1] % SEGUNDA.length]}`;
}

export function PalavraCodigo() {
  const [palavra, setPalavra] = useState<string | null>(null);

  return (
    <div className="rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
      <p className="etiqueta">Sugestão de palavra-código</p>

      <p
        className="mt-4 font-display text-2xl font-semibold text-menta md:text-3xl"
        aria-live="polite"
      >
        {palavra ?? "— — —"}
      </p>

      <button
        type="button"
        onClick={() => setPalavra(sortear())}
        className="mt-5 min-h-touch rounded-sm border border-chumbo-linhaForte px-5 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
      >
        {palavra ? "Sortear outra" : "Sortear uma palavra"}
      </button>

      <p className="mt-5 text-sm leading-relaxed text-papel-3">
        Sorteada no seu navegador, sem envio. Combine pessoalmente com a
        família. Nunca por mensagem: se invadirem sua conta, o golpista lê a palavra.
      </p>
    </div>
  );
}
