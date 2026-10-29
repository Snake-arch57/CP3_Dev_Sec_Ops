import Link from "next/link";
import { HeroDossie } from "@/components/home/HeroDossie";
import { Indice } from "@/components/home/Indice";

export default function HomePage() {
  return (
    <>
      <HeroDossie />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <p className="etiqueta">O que tem aqui</p>
          <h2 className="mt-4 max-w-3xl font-display text-title font-semibold text-balance">
            Seis partes. Comece por qualquer uma.
          </h2>
          <p className="mt-5 max-w-2xl text-bodyLg text-papel-2 text-pretty">
            Aprenda fazendo: teste sua senha e tente achar o golpe.
          </p>

          <div className="mt-12">
            <Indice />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-body text-papel-2">
              Não entendeu uma palavra?
            </p>
            <Link
              href="/glossario"
              className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linha px-5 py-3 font-display text-sm text-papel-2 transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Veja o glossário →
            </Link>
          </div>
        </div>
      </section>

      {/* A ausência de estatística é uma escolha declarada, não um esquecimento. */}
      <section className="border-y border-chumbo-linha bg-chumbo-painel/40 py-16 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Sobre os números</p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-balance md:text-3xl">
            Aqui, número só entra com fonte
          </h2>
          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Cada número mostra autor, publicação e ano. Por isso são poucos.
          </p>
          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            Só viram link os endereços oficiais conferidos. Os outros aparecem
            como pendentes.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-10 border-l-2 border-menta pl-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="etiqueta-risco">No trabalho</p>
              <h2 className="mt-4 font-display text-2xl font-semibold text-balance md:text-3xl">
                Os mesmos golpes, no trabalho
              </h2>
            </div>
            <div>
              <p className="text-body leading-relaxed text-papel-2 text-pretty">
                Exemplos: QR Code trocado na maquininha e boleto de fornecedor
                com a conta alterada. Avisar rápido vale mais que qualquer ajuste.
              </p>
              <Link
                href="/no-trabalho"
                className="mt-6 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
              >
                Ver golpes no trabalho →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
