import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { QualEGolpe } from "./QualEGolpe";

export const metadata: Metadata = {
  title: "Qual deles é golpe?",
  description:
    "Mensagens do dia a dia: descubra qual é golpe.",
};

export default function GolpePage() {
  return (
    <>
      <PageHeader
        numero="02"
        eyebrow="Qual deles é golpe?"
        title="Chegaram duas mensagens. Qual é golpe?"
        description="Escolha uma e veja as pistas marcadas."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "Golpe usa sua pressa e sua confiança.",
              "Desconfie de pressa em mensagem que você não esperava.",
              "Os detalhes mudam. O jeito do golpe, não.",
            ]}
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-12 max-w-2xl border-l-2 border-chumbo-linha pl-5">
            <p className="text-body text-papel-2 text-pretty">
              Errar é normal. Quem cai não é bobo: a mensagem é bem feita.
            </p>
          </div>

          <QualEGolpe />

          <TermosRelacionados
            ids={[
              "dominio",
              "https",
              "phishing",
              "engenharia-social",
            ]}
          />
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">A regra que vale para tudo</p>
          <p className="mt-4 text-bodyLg text-papel text-pretty">
            Não use o link nem o número da mensagem. Abra o app, ligue para o
            número que você já tinha ou digite o site à mão.
          </p>

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              Agora veja como o golpe chega até você.
            </p>
            <Link
              href="/anatomia"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Próximo · Como o golpe funciona por dentro →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
