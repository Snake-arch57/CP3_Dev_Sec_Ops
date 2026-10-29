import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { MUDANCAS, DEFESAS } from "@/lib/ia";
import { Triagem } from "./Triagem";
import { PalavraCodigo } from "./PalavraCodigo";

export const metadata: Metadata = {
  title: "Inteligência artificial",
  description:
    "O que a IA mudou nos golpes e as defesas que continuam funcionando.",
};

export default function IaPage() {
  return (
    <>
      <PageHeader
        numero="04"
        eyebrow="Inteligência artificial"
        title="O que a IA mudou nos golpes"
        description="E o que você não deve contar para ela. A boa notícia: as defesas de sempre ainda funcionam."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "O que você escreve numa IA sai do seu aparelho e pode ser usado para treiná-la.",
              "Voz e rosto já podem ser imitados a ponto de enganar quem conhece a pessoa.",
              "Não tente adivinhar se é falso. Use palavra-código, ligue você mesmo, leia o nome no PIX e ative a verificação em duas etapas.",
            ]}
          />
        </div>
      </section>

      {/* Parte 1 — privacidade */}
      <section className="py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Parte 1</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance md:text-3xl">
            O que você escreve numa IA sai do seu aparelho
          </h2>

          <p className="mt-5 text-bodyLg leading-relaxed text-papel-2 text-pretty">
            Cada mensagem que você manda para uma IA vai para a empresa dona
            dela.
          </p>

          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            Lá, a conversa pode ficar guardada, treinar a IA e ser lida por
            pessoas. Apagar o chat nem sempre apaga tudo.
          </p>

          <div className="mt-8 border-l-2 border-menta py-2 pl-5">
            <p className="etiqueta-risco">A regra prática</p>
            <p className="mt-2 text-body leading-relaxed text-papel text-pretty">
              Antes de colar, pense: eu mostraria isso a um desconhecido que
              vai guardar uma cópia? Se não, não cole.
            </p>
          </div>

          <h3 className="mt-14 font-display text-xl font-semibold">
            Isso pode ir para uma IA pública?
          </h3>
          <p className="mt-3 text-body leading-relaxed text-papel-2 text-pretty">
            Decida cada caso e veja a resposta.
          </p>

          <div className="mt-8">
            <Triagem />
          </div>

          <div className="mt-12 rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
            <p className="etiqueta">Três ajustes que valem a pena</p>
            <ul className="mt-4 space-y-3.5 text-body leading-relaxed text-papel-2">
              <li>
                <strong className="font-semibold text-papel">
                  Não deixe suas conversas treinarem a IA.
                </strong>{" "}
                Essa opção costuma vir ligada. Desligue nas configurações.
              </li>
              <li>
                <strong className="font-semibold text-papel">
                  Use a conversa sem histórico para assunto delicado.
                </strong>{" "}
                É como a janela anônima do navegador.
              </li>
              <li>
                <strong className="font-semibold text-papel">
                  No trabalho, use só a IA aprovada pela empresa.
                </strong>{" "}
                Desconfie de app “com IA” desconhecido.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Parte 2 — o que mudou nos golpes */}
      <section className="border-y border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Parte 2</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance md:text-3xl">
            O que a IA mudou no golpe
          </h2>
          <p className="mt-5 text-bodyLg leading-relaxed text-papel-2 text-pretty">
            Os golpes são os mesmos. A IA só deixou mais fácil fazer golpe bem
            feito.
          </p>

          <ol className="mt-10 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {MUDANCAS.map((m, i) => (
              <li key={m.titulo} className="py-7">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm text-menta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-balance">
                    {m.titulo}
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="etiqueta">Como era</p>
                    <p className="mt-1.5 text-body leading-relaxed text-papel-2 text-pretty">
                      {m.oQueEra}
                    </p>
                  </div>
                  <div>
                    <p className="etiqueta">O que mudou</p>
                    <p className="mt-1.5 text-body leading-relaxed text-papel-2 text-pretty">
                      {m.oQueMudou}
                    </p>
                  </div>
                  <div className="border-l-2 border-menta py-1 pl-4">
                    <p className="etiqueta-risco">
                      O que fazer
                    </p>
                    <p className="mt-1.5 text-body leading-relaxed text-papel-2 text-pretty">
                      {m.oQueFazer}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Parte 3 — o que continua funcionando */}
      <section className="py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Parte 3</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance md:text-3xl">
            O que continua funcionando
          </h2>
          <p className="mt-5 text-bodyLg leading-relaxed text-papel-2 text-pretty">
            Você não precisa perceber o que é falso. Basta conferir.
          </p>

          <ul className="mt-10 space-y-6">
            {DEFESAS.map((d) => (
              <li key={d.titulo} className="border-l-2 border-menta pl-5">
                <h3 className="font-display text-lg font-semibold">{d.titulo}</h3>
                <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                  {d.texto}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <PalavraCodigo />
          </div>
        </div>
      </section>

      {/* Parte 4 — a incerteza, dita na cara */}
      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">A parte honesta</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance md:text-3xl">
            Boa parte disso ainda não se sabe
          </h2>

          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Este assunto muda rápido. Ainda faltam dados confiáveis sobre o
            problema no Brasil.
          </p>

          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            Por isso não há números aqui. Os que circulam vêm quase todos de
            quem vende segurança. Quando houver dado oficial, ele entra com
            fonte.
          </p>

          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            A IA também protege: filtra spam, ajuda o banco a notar movimento
            estranho e derruba perfil falso.
          </p>

          <p className="mt-6 border-l-2 border-chumbo-linhaForte py-1 pl-5 text-body leading-relaxed text-papel-2 text-pretty">
            Ficou com dúvida sobre IA? Escreva pela página de Contato.
          </p>

          <TermosRelacionados
            ids={[
              "deepfake",
              "phishing",
              "engenharia-social",
              "lgpd",
            ]}
          />

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              A seguir: os ajustes que diminuem seu risco, com ou sem IA.
            </p>
            <Link
              href="/agora"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Próximo · O que fazer agora →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
