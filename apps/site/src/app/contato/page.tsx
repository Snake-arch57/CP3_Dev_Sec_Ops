import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a equipe dos Hackudinhos.",
};

const CANAIS = [
  {
    rotulo: "E-mail do projeto",
    valor: "contato@cifra.dev",
    href: "mailto:contato@cifra.dev",
  },
  {
    rotulo: "Contexto acadêmico",
    valor: "Challenge de Defesa Cibernética · parceria Leroy Merlin",
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contato"
        title="Achou um erro? Fale com a gente"
        description="Dado errado, link quebrado ou dica velha? Conte para nós."
      />

      <section className="py-14 md:py-20">
        <div className="container-read">
          {/* O que alguém em pânico precisa ler primeiro nesta página. */}
          {/* Bloco cheio, texto invertido: é o formato que o manual reserva
              para risco, e este é o aviso mais urgente da página. */}
          <div className="bloco-risco rounded-sm p-6">
            <p className="font-display text-xs font-medium uppercase tracking-etiqueta">
              Está caindo num golpe agora?
            </p>
            <p className="mt-3 text-body font-medium leading-relaxed text-pretty">
              Não escreva para cá: não temos plantão. Ligue para o seu banco
              pelo número do verso do cartão. A página{" "}
              <a href="/ja-cai" className="underline underline-offset-4">
                “Já caí num golpe”
              </a>{" "}
              mostra o passo a passo e os canais oficiais.
            </p>
          </div>

          <dl className="mt-12 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {CANAIS.map((c) => (
              <div key={c.rotulo} className="py-5">
                <dt className="etiqueta">{c.rotulo}</dt>
                <dd className="mt-2 font-display text-base">
                  {c.href ? (
                    <a
                      href={c.href}
                      className="text-menta underline decoration-menta/40 underline-offset-4 hover:decoration-menta"
                    >
                      {c.valor}
                    </a>
                  ) : (
                    <span className="text-papel-2">{c.valor}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm leading-relaxed text-papel-3">
            Não há formulário: por enquanto, ele não enviaria sua mensagem.
          </p>
        </div>
      </section>
    </>
  );
}
