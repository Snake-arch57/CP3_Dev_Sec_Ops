"use client";

import { useMemo, useState, useId } from "react";
import {
  analisar,
  formatarDuracao,
  COMPARATIVO,
  PALPITES_POR_SEGUNDO,
  PALPITES_ONLINE,
} from "@/lib/senha";

const forcaCor = (bits: number, fraca: boolean) => {
  if (fraca || bits < 40) return "bg-ambar";
  if (bits < 70) return "bg-menta";
  return "bg-menta";
};

export function TesteSenha() {
  const [senha, setSenha] = useState("");
  const [visivel, setVisivel] = useState(false);
  const campoId = useId();
  const ajudaId = useId();

  const a = useMemo(() => analisar(senha), [senha]);
  const preenchimento = Math.min(100, (a.bits / 90) * 100);

  const comparativo = useMemo(
    () =>
      COMPARATIVO.map((c) => ({
        ...c,
        analise: analisar(c.senha),
      })),
    [],
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
      <div>
        {/* Campo */}
        <label htmlFor={campoId} className="etiqueta block">
          Digite uma senha para testar
        </label>

        <div className="mt-3 flex gap-2">
          <input
            id={campoId}
            type={visivel ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-describedby={ajudaId}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="pode ser inventada na hora"
            className="min-h-touch w-full rounded-sm border border-chumbo-linhaForte bg-chumbo-painel px-4 py-3 font-display text-base text-papel
                       transition-colors duration-200 placeholder:text-papel-3 hover:border-papel-3
                       focus:border-menta focus:outline-none focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={() => setVisivel((v) => !v)}
            aria-pressed={visivel}
            className="min-h-touch shrink-0 rounded-sm border border-chumbo-linhaForte px-4 font-display text-sm text-papel-2 transition-colors duration-200 hover:bg-chumbo-painel hover:text-papel"
          >
            {visivel ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {/* Aviso ao lado do campo, não no rodapé. */}
        <p
          id={ajudaId}
          className="mt-3 rounded-sm border border-menta/30 bg-menta-900/60 p-4 text-sm leading-relaxed text-papel-2"
        >
          <strong className="font-semibold text-papel">
            O que você digitar não sai daqui.
          </strong>{" "}
          Nada é enviado nem salvo. Mesmo assim, teste uma senha parecida, não
          a verdadeira.
        </p>

        {/* Resultado */}
        <div className="mt-8 rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
          <p className="etiqueta">
            Tempo para testar todas as combinações
          </p>

          <div aria-live="polite" aria-atomic="true">
            {/* O número fica em papel: âmbar solto seria acento, o que o
                manual proíbe. Quem alarma é a etiqueta em bloco cheio. */}
            <p
              className={`mt-3 font-display text-title font-semibold tabular ${
                senha.length === 0 ? "text-papel-3" : "text-papel"
              }`}
            >
              {senha.length === 0 ? "—" : formatarDuracao(a.segundos)}
            </p>

            {senha.length > 0 && (
              <p className="mt-3">
                <span className={a.fraca ? "etiqueta-risco" : "font-display text-sm uppercase tracking-etiqueta text-menta"}>
                  {a.fraca ? "Frágil" : "Resistente"}
                </span>
              </p>
            )}

            <p className="mt-4 text-sm leading-relaxed text-papel-2">
              {a.veredito}
            </p>
          </div>

          {/* Barra de entropia */}
          <div className="mt-6">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-chumbo-painel"
              role="img"
              aria-label={`Força estimada: ${Math.round(a.bits)} bits`}
            >
              <div
                className={`h-full transition-all duration-300 ease-marca ${forcaCor(a.bits, a.fraca)}`}
                style={{ width: `${preenchimento}%` }}
              />
            </div>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-display text-xs text-papel-3">
              <div className="flex gap-2">
                <dt>caracteres</dt>
                <dd className="text-papel-2 tabular-nums">{a.comprimento}</dd>
              </div>
              <div className="flex gap-2">
                <dt>variedade</dt>
                <dd className="text-papel-2 tabular-nums">{a.alfabeto}</dd>
              </div>
              <div className="flex gap-2">
                <dt>força</dt>
                <dd className="text-papel-2 tabular-nums">
                  {Math.round(a.bits)} bits
                </dd>
              </div>
            </dl>
          </div>

          {senha.length > 0 && (
            <div className="mt-6 border-t border-chumbo-linha pt-5">
              <p className="etiqueta">Se o golpista tentar direto no site</p>
              <p className="mt-2 font-display text-sm text-papel-2">
                {formatarDuracao(a.segundosOnline)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-papel-3">
                Demora mais, porque o site bloqueia. O número de cima é o pior
                caso.
              </p>
            </div>
          )}

          {a.pareceFrase && (
            <div className="mt-6 border-t border-chumbo-linha pt-5">
              <p className="etiqueta-risco">Atenção</p>
              <p className="mt-2 text-sm leading-relaxed text-papel-2">
                Parece uma frase. Se veio de música, versículo ou ditado, cai
                bem mais rápido.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 font-display text-xs leading-relaxed text-papel-3">
          A conta supõe {PALPITES_POR_SEGUNDO.toLocaleString("pt-BR")}{" "}
          tentativas por segundo com senhas vazadas e {PALPITES_ONLINE} por
          segundo direto no site. Outros testes supõem outros números.
        </p>
      </div>

      {/* Coluna lateral */}
      <div className="space-y-8">
        <div className="rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
          <h2 className="font-display text-lg font-semibold">
            Tamanho vale mais que símbolos
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-papel-2">
            Cada letra a mais multiplica o trabalho do golpista.
          </p>

          <ul className="mt-5 space-y-4">
            {comparativo.map((c) => (
              <li key={c.senha} className="border-t border-chumbo-linha pt-4">
                <p className="text-xs leading-relaxed text-papel-3">{c.rotulo}</p>
                <p className="mt-1.5 break-all font-display text-sm text-papel">
                  {c.senha}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm tabular text-papel">
                    {formatarDuracao(c.analise.segundos)}
                  </span>
                  {c.analise.fraca && (
                    <span className="etiqueta-risco">Frágil</span>
                  )}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-chumbo-linha pt-4 text-sm leading-relaxed text-papel-2">
            A terceira é fácil de lembrar e a mais forte, se as palavras forem
            sorteadas.
          </p>
        </div>

        <div className="rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
          <h2 className="font-display text-lg font-semibold">
            Na prática
          </h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-papel-2">
            <li>
              <strong className="font-semibold text-papel">
                Use um gerenciador de senhas.
              </strong>{" "}
              Ele cria e guarda uma senha para cada site. Bitwarden, 1Password,
              KeePassXC e o do navegador servem.
            </li>
            <li>
              <strong className="font-semibold text-papel">
                Não repita senha.
              </strong>{" "}
              Se um site vaza, os golpistas testam a mesma senha no seu e-mail
              e no banco.
            </li>
            <li>
              <strong className="font-semibold text-papel">
                Proteja o e-mail primeiro.
              </strong>{" "}
              Quem entra nele troca a senha de todo o resto. Ligue a
              verificação em duas etapas.
            </li>
            <li>
              <strong className="font-semibold text-papel">
                Troque só quando houver motivo.
              </strong>{" "}
              Motivo é suspeita de invasão ou vazamento.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
