"use client";

import { useState } from "react";
import { TRIAGEM } from "@/lib/ia";

/**
 * Exercício de triagem: "isso pode ir para uma IA pública?".
 *
 * De propósito não é um quiz do tipo "adivinhe qual texto foi escrito por IA".
 * Esse quiz ensinaria uma habilidade falsa — hoje não dá para distinguir de
 * forma confiável, e quem sai achando que consegue fica mais vulnerável, não
 * menos. Aqui a habilidade treinada é a que existe: decidir o que sai do seu
 * aparelho antes de colar.
 */
export function Triagem() {
  const [respostas, setRespostas] = useState<Record<string, boolean>>({});

  const responder = (id: string, escolha: boolean) =>
    setRespostas((p) => ({ ...p, [id]: escolha }));

  const respondidos = Object.keys(respostas).length;

  return (
    <div>
      <p className="font-display text-sm text-papel-3" aria-live="polite">
        {respondidos} de {TRIAGEM.length} respondidos
      </p>

      <ul className="mt-6 space-y-4">
        {TRIAGEM.map((item) => {
          const resposta = respostas[item.id];
          const respondido = resposta !== undefined;
          const acertou = respondido && resposta === item.seguro;

          return (
            <li
              key={item.id}
              className={`rounded-sm border bg-chumbo-painel transition-colors duration-200 ${
                !respondido
                  ? "border-chumbo-linha"
                  : item.seguro
                    ? "border-menta/50"
                    : "border-chumbo-linhaForte"
              }`}
            >
              <div className="p-5">
                <p className="text-body leading-relaxed text-papel text-pretty">
                  {item.texto}
                </p>

                {!respondido ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => responder(item.id, true)}
                      className="min-h-touch rounded-sm border border-chumbo-linhaForte px-5 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
                    >
                      Pode colar
                    </button>
                    <button
                      type="button"
                      onClick={() => responder(item.id, false)}
                      className="min-h-touch rounded-sm border border-chumbo-linhaForte px-5 font-display text-sm text-papel transition-colors duration-200 hover:border-ambar hover:text-papel"
                    >
                      Não pode
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 border-t border-chumbo-linha pt-4">
                    <p className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          item.seguro
                            ? "font-display text-sm uppercase tracking-etiqueta text-menta"
                            : "etiqueta-risco"
                        }
                      >
                        {item.seguro ? "Pode colar" : "Não pode"}
                      </span>
                      {!acertou && (
                        <span className="text-sm text-papel-3">
                          você marcou o contrário
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                      {item.motivo}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {respondidos > 0 && (
        <button
          type="button"
          onClick={() => setRespostas({})}
          className="mt-6 min-h-touch rounded-sm border border-chumbo-linha px-4 font-display text-sm text-papel-3 transition-colors duration-200 hover:border-chumbo-linhaForte hover:text-papel-2"
        >
          Recomeçar
        </button>
      )}
    </div>
  );
}
