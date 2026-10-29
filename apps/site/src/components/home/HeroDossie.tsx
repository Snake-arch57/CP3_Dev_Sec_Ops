"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  coletarDossie,
  lerCamposVivos,
  apagarVisita,
  NAO_VISIVEL,
  type Entrada,
} from "@/lib/dossie";

/** Intervalo entre as linhas da cascata. */
const PASSO_MS = 140;

export function HeroDossie() {
  const semMovimento = useReducedMotion();
  const [entradas, setEntradas] = useState<Entrada[] | null>(null);
  const [vivos, setVivos] = useState<Record<string, string>>({});
  const [apagado, setApagado] = useState(false);

  useEffect(() => {
    // Sem trava de "já rodou": a coleta é barata e idempotente, e a resposta
    // de "já esteve aqui" é decidida uma vez só dentro de `lerEMarcarVisita`.
    // A versão anterior tinha uma trava por `useRef` que, combinada com o
    // cancelamento abaixo, deixava o dossiê vazio ao voltar para a home por
    // navegação — a segunda montagem saía cedo e a primeira já tinha sido
    // cancelada, então nada preenchia a lista.
    let ativo = true;

    coletarDossie().then((lista) => {
      if (!ativo) return;
      setEntradas(lista);
      setVivos(lerCamposVivos());
    });

    return () => {
      ativo = false;
    };
  }, []);

  // Campos que mudam sozinhos: relógio a cada segundo, janela a cada resize.
  useEffect(() => {
    if (!entradas) return;
    const atualizar = () => setVivos(lerCamposVivos());
    const timer = window.setInterval(atualizar, 1000);
    window.addEventListener("resize", atualizar);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", atualizar);
    };
  }, [entradas]);

  function handleApagar() {
    if (apagarVisita()) {
      setApagado(true);
      setEntradas(
        (atual) =>
          atual?.map((e) =>
            e.id === "visita" ? { ...e, valor: "primeira visita" } : e,
          ) ?? null,
      );
    }
  }

  const total = entradas?.length ?? 0;
  const duracaoCascata = semMovimento ? 0 : (total * PASSO_MS) / 1000;

  return (
    <section className="relative border-b border-chumbo-linha pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="container-page">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
          {/* Coluna da manchete */}
          <div className="lg:sticky lg:top-28">
            <p className="etiqueta flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-menta">
                só no seu navegador
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block animate-caret"
                >
                  _
                </span>
              </span>
              <span aria-hidden="true" className="text-chumbo-linhaForte">
                ·
              </span>
              <span>nada é enviado</span>
            </p>

            <h1 className="mt-6 font-display text-hero font-semibold text-balance">
              Você já está{" "}
              <span className="text-menta">exposto</span>.
            </h1>

            <p className="mt-7 max-w-xl text-bodyLg text-papel-2 text-pretty">
              Sem você digitar nada, esta página montou uma ficha sua. Qualquer
              site consegue.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#a-virada"
                className="inline-flex min-h-touch items-center rounded-sm bg-menta px-6 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-menta-400"
              >
                O que isso quer dizer?
              </Link>
              <Link
                href="/ja-cai"
                className="inline-flex min-h-touch items-center rounded-sm bg-ambar px-6 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-[#F5BB63]"
              >
                Já caí num golpe
              </Link>
            </div>
          </div>

          {/* Coluna do dossiê */}
          <div>
            <div className="rounded-sm border border-chumbo-linha bg-chumbo-painel">
              <div className="flex items-center justify-between gap-4 border-b border-chumbo-linha px-5 py-3">
                <p className="etiqueta">Sua ficha</p>
                <p className="font-display text-[0.6875rem] text-papel-3">
                  {total > 0 ? `${total} campos` : "lendo…"}
                </p>
              </div>

              <dl
                className="divide-y divide-chumbo-linha"
                style={{ minHeight: entradas ? undefined : "32rem" }}
              >
                {entradas?.map((e, i) => {
                  const valor = e.vivo ? (vivos[e.id] ?? e.valor) : e.valor;
                  return (
                    <div
                      key={e.id}
                      className={semMovimento ? undefined : "mask-in"}
                      style={
                        semMovimento
                          ? undefined
                          : { animationDelay: `${i * PASSO_MS}ms` }
                      }
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 pt-4">
                        <dt className="etiqueta">{e.label}</dt>
                        <dd
                          className={`font-display text-sm ${
                            e.available ? "text-papel" : "text-papel-3 italic"
                          }`}
                        >
                          {valor}
                        </dd>
                      </div>
                      <p className="px-5 pb-4 pt-1.5 text-sm leading-relaxed text-papel-3">
                        {e.nota}
                      </p>
                    </div>
                  );
                })}

                {!entradas && (
                  <div className="px-5 py-6">
                    <p className="font-display text-sm text-papel-3">
                      Montando sua ficha…
                    </p>
                  </div>
                )}
              </dl>
            </div>

            {/* Aviso de privacidade: na tela, ao lado do dado, não no rodapé. */}
            <div className="mt-4 rounded-sm border border-menta/30 bg-menta-900/60 p-5">
              <p className="etiqueta text-menta">
                O que acontece com esses dados
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-papel-2">
                <strong className="font-semibold text-papel">Nada.</strong> Nenhum
                dado sai do seu aparelho. Tudo some quando você fecha a aba.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-papel-2">
                Só a última linha fica guardada, como uma marca na memória do
                navegador. Não sai daqui.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApagar}
                  disabled={apagado}
                  className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-4 py-2 font-display text-sm text-papel transition-colors duration-200 hover:bg-chumbo-painel disabled:cursor-default disabled:border-chumbo-linha disabled:text-papel-3"
                >
                  {apagado ? "Marca apagada" : "Apagar a marca"}
                </button>
                {apagado && (
                  <span className="font-display text-sm text-menta">
                    Pronto. Esta página esqueceu você.
                  </span>
                )}
              </div>
            </div>

            {/* O contraponto. Sem ele a lista de cima vira alarmismo. */}
            <div className="mt-4 rounded-sm border border-chumbo-linha bg-chumbo-painel/60 p-5">
              <p className="etiqueta">O que esta página não vê</p>
              <p className="mt-2.5 text-sm leading-relaxed text-papel-2">
                Ajuda a pegar golpista que blefa.
              </p>

              <dl className="mt-4 divide-y divide-chumbo-linha border-t border-chumbo-linha">
                {NAO_VISIVEL.map((n) => (
                  <div key={n.item} className="py-3.5">
                    <dt className="flex gap-2.5 font-display text-sm text-papel">
                      <span aria-hidden="true" className="text-menta">
                        ✕
                      </span>
                      {n.item}
                    </dt>
                    <dd className="mt-1.5 pl-6 text-sm leading-relaxed text-papel-3">
                      {n.porque}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* A virada */}
        <div
          id="a-virada"
          className="mt-20 border-t border-chumbo-linha pt-12 md:mt-28 md:pt-16"
          style={
            semMovimento
              ? undefined
              : { animationDelay: `${duracaoCascata + 0.2}s` }
          }
        >
          <div className="max-w-3xl">
            <p className="etiqueta">Por que importa</p>
            <p className="mt-5 font-display text-title text-balance">
              Nada disso saiu daqui.{" "}
              <span className="text-papel-2">
                Mas qualquer site vê.
              </span>
            </p>
            <p className="mt-7 max-w-2xl text-bodyLg text-papel-2 text-pretty">
              Não é invasão, é como a internet funciona. Juntos, esses dados
              formam um rastro que o navegador deixa. Com ele, o golpista faz a
              mensagem parecer pessoal.
            </p>
            <p className="mt-5 max-w-2xl text-bodyLg text-papel-2 text-pretty">
              A seguir: como se proteger.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
