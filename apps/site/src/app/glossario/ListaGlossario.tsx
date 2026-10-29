"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { GRUPOS, VERBETES } from "@/lib/glossario";
import { TextoRico } from "@/components/ui/TextoRico";

/**
 * O conteúdo inteiro é renderizado no servidor mesmo sendo client component,
 * então o glossário continua legível e navegável por âncora sem JavaScript.
 * A busca e o realce do índice são melhoria progressiva.
 *
 * Layout: índice fixo na coluna da esquerda, verbetes correndo à direita.
 * A busca mora dentro do índice de propósito — quando ela era uma barra
 * grudada no topo da coluna de leitura, cada rolagem escondia uma faixa do
 * texto atrás dela.
 */

/**
 * Ignora acento e caixa, porque ninguém digita "força bruta" com cedilha na
 * pressa.
 *
 * `normalize("NFD")` separa a letra do acento; `\p{Mn}` casa exatamente as
 * marcas que sobraram. Usar a propriedade Unicode em vez de um intervalo
 * literal mantém o fonte só com ASCII — intervalo de caracteres combinantes
 * é invisível no editor e quebra sem ninguém perceber se o arquivo for
 * salvo na codificação errada.
 */
function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "");
}

export function ListaGlossario() {
  const [busca, setBusca] = useState("");
  const [ativo, setAtivo] = useState<string | null>(null);
  const [indiceAberto, setIndiceAberto] = useState(false);
  const campoId = useId();
  const listaRef = useRef<HTMLDivElement>(null);

  const filtrados = useMemo(() => {
    const q = normalizar(busca.trim());
    if (!q) return VERBETES;
    return VERBETES.filter((v) =>
      normalizar(
        `${v.termo} ${v.tambem ?? ""} ${v.definicao} ${v.importa}`,
      ).includes(q),
    );
  }, [busca]);

  // Realce do índice conforme o verbete entra na tela. A faixa estreita no
  // topo evita que dois verbetes disputem o destaque ao mesmo tempo.
  useEffect(() => {
    const alvos = listaRef.current?.querySelectorAll("[data-verbete]");
    if (!alvos?.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visivel) setAtivo(visivel.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filtrados]);

  const gruposVisiveis = GRUPOS.map((g) => ({
    ...g,
    verbetes: filtrados.filter((v) => v.grupo === g.id),
  })).filter((g) => g.verbetes.length > 0);

  const campoBusca = (
    <div>
      <label htmlFor={campoId} className="etiqueta block">
        Buscar termo
      </label>
      <input
        id={campoId}
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="cadeado, chip, pix…"
        className="mt-2 min-h-touch w-full rounded-sm border border-chumbo-linhaForte bg-chumbo-painel px-3 font-display text-sm text-papel
                   transition-colors duration-200 placeholder:text-papel-3 hover:border-papel-3
                   focus:border-menta focus:outline-none focus-visible:outline-none"
      />
      <p className="mt-2 font-display text-xs text-papel-3" aria-live="polite">
        {busca.trim()
          ? `${filtrados.length} de ${VERBETES.length} termos`
          : `${VERBETES.length} termos`}
      </p>
    </div>
  );

  /**
   * O índice é montado uma vez só e reaproveitado nos dois layouts.
   *
   * Antes ele era renderizado duas vezes — dentro do `<details>` do celular e
   * de novo numa `<div>` só de desktop — o que duplicava 42 links e dois
   * elementos `<nav>` com o mesmo rótulo acessível.
   */
  const indice = (
    <nav aria-label="Índice do glossário" className="mt-6 space-y-6">
      {gruposVisiveis.map((g) => (
        <div key={g.id}>
          <p className="etiqueta">{g.titulo}</p>
          <ul className="mt-2 space-y-px">
            {g.verbetes.map((v) => {
              const atual = ativo === v.id;
              return (
                <li key={v.id}>
                  <a
                    href={`#${v.id}`}
                    aria-current={atual ? "true" : undefined}
                    // No celular o índice vive recolhido: sem fechar ao
                    // clicar, os 42 itens continuavam abertos empurrando o
                    // verbete para fora da tela, e parecia que o link não
                    // tinha levado a lugar nenhum.
                    onClick={() => setIndiceAberto(false)}
                    className={`block border-l-2 py-1.5 pl-3 font-display text-sm transition-colors duration-200 ${
                      atual
                        ? "border-menta text-papel"
                        : "border-transparent text-papel-3 hover:border-chumbo-linhaForte hover:text-papel-2"
                    }`}
                  >
                    {v.termo}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
      {/* Índice — fixo no desktop, recolhido no celular */}
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pb-8">
        {campoBusca}

        {/* Celular: botão que abre e fecha o mesmo índice do desktop. */}
        <button
          type="button"
          onClick={() => setIndiceAberto((v) => !v)}
          aria-expanded={indiceAberto}
          aria-controls="indice-glossario"
          className="mt-4 flex min-h-touch w-full items-center justify-between rounded-sm border border-chumbo-linha px-4 font-display text-sm text-papel-2 transition-colors duration-200 hover:text-papel lg:hidden"
        >
          {indiceAberto ? "Fechar índice" : "Ir direto a um termo"}
          <span aria-hidden="true" className="text-papel-3">
            {indiceAberto ? "×" : `${filtrados.length}`}
          </span>
        </button>

        <div
          id="indice-glossario"
          className={indiceAberto ? "block" : "hidden lg:block"}
        >
          {indice}
        </div>
      </aside>

      {/* Verbetes */}
      <div ref={listaRef}>
        {filtrados.length === 0 && (
          <p className="text-body text-papel-2">
            Nenhum termo com essa palavra. Se faltou algum, avise a gente.
          </p>
        )}

        <div className="space-y-14">
          {gruposVisiveis.map((g) => (
            <section key={g.id} aria-labelledby={`grupo-${g.id}`}>
              <h2
                id={`grupo-${g.id}`}
                className="font-display text-xl font-semibold text-balance md:text-2xl"
              >
                {g.titulo}
              </h2>
              <p className="mt-2 text-body text-papel-2 text-pretty">
                {g.descricao}
              </p>

              {/* Estrutura simples de propósito: `<div>` dentro de `<dl>` é
                  válido em HTML5, mas confunde extensão de navegador e
                  ferramenta de acessibilidade. Lista comum resolve igual. */}
              <ul className="mt-6 divide-y divide-chumbo-linha border-y border-chumbo-linha">
                {g.verbetes.map((v) => (
                  <li
                    key={v.id}
                    id={v.id}
                    data-verbete
                    // Sem `scroll-mt` aqui: o `scroll-padding-top` do <html>
                    // já compensa a navbar fixa, e os dois somavam, jogando o
                    // verbete para o meio da tela em vez do topo.
                    className="verbete py-7"
                  >
                    <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-lg font-semibold text-papel">
                        {v.termo}
                      </span>
                      {v.tambem && (
                        <span className="font-display text-sm font-normal text-papel-3">
                          também: {v.tambem}
                        </span>
                      )}
                    </h3>

                    <p className="mt-3 text-body leading-relaxed text-papel-2 text-pretty">
                      <TextoRico>{v.definicao}</TextoRico>
                    </p>

                    <div className="mt-4 border-l-2 border-chumbo-linhaForte py-1 pl-4">
                      <p className="etiqueta">Por que isso importa</p>
                      <p className="mt-1.5 text-body leading-relaxed text-papel-2 text-pretty">
                        <TextoRico>{v.importa}</TextoRico>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
