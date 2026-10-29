import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListaGlossario } from "./ListaGlossario";

export const metadata: Metadata = {
  title: "Glossário",
  description:
    "As palavras que você vê no noticiário e nas configurações do celular, explicadas em português comum.",
};

export default function GlossarioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Glossário"
        title="As palavras, em português comum"
        description="Você não precisa disto para se proteger. É para quando você ouve uma palavra e quer saber o que ela quer dizer."
      />

      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-10 max-w-2xl border-l-2 border-menta pl-5">
            <p className="text-body text-papel-2 text-pretty">
              Se for ler só um, leia{" "}
              <Link
                href="/glossario#https"
                className="text-papel underline decoration-menta/50 underline-offset-4 hover:decoration-menta"
              >
                o cadeado do navegador
              </Link>
              . Ele não protege como muita gente acha.
            </p>
          </div>

          <ListaGlossario />

          <div className="mt-16 max-w-2xl border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2 text-pretty">
              Faltou alguma palavra que você viu por aí? Mande para a gente.
            </p>
            <Link
              href="/contato"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Sugerir um termo →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
