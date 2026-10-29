import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Fonte } from "@/components/ui/Fonte";

export const metadata: Metadata = {
  title: "Sobre o projeto",
  description:
    "Quem são os Hackudinhos e como o site é feito.",
};

const REGRAS = [
  {
    titulo: "Número só com fonte",
    texto:
      "Todo número mostra autor, publicação e ano. Sem fonte confirmada, ele sai.",
  },
  {
    titulo: "Nada de link inventado",
    texto:
      "Só entram links oficiais que conferimos.",
  },
  {
    titulo: "Conselho velho também engana",
    texto:
      "O site avisa quando um conselho envelheceu, como trocar a senha todo mês.",
  },
  {
    titulo: "Nunca culpar quem caiu",
    texto: "Golpe pega qualquer um. A vergonha só atrasa a reação.",
  },
  {
    titulo: "Nada é enviado a lugar nenhum",
    texto:
      "O que você digita ou marca aqui fica só no seu navegador. Não há rastreador. O navegador só salva a marca de “já esteve aqui”, e você pode apagá-la.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre o projeto"
        title="Um site feito para ser confiável"
        description="Projeto acadêmico de Defesa Cibernética, feito no Challenge com a Leroy Merlin."
      />

      <section className="py-14 md:py-20">
        <div className="container-read">
          <h2 className="font-display text-2xl font-semibold">
            Por que ele é assim
          </h2>
          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Decorar regras não basta.
          </p>
          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            Aqui, você testa e vê o golpe na prática.
          </p>

          <h2 className="mt-14 font-display text-2xl font-semibold">
            As regras que o conteúdo segue
          </h2>
          <ul className="mt-8 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {REGRAS.map((r) => (
              <li key={r.titulo} className="py-6">
                <h3 className="font-display text-lg font-semibold text-balance">
                  {r.titulo}
                </h3>
                <p className="mt-2.5 text-body leading-relaxed text-papel-2 text-pretty">
                  {r.texto}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-display text-2xl font-semibold">
            Acessibilidade
          </h2>
          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Feito para quem tem pouca prática com tecnologia. Letras bem
            visíveis, uso pelo teclado, botões grandes e respeito a quem desliga
            animações.
          </p>
          <Fonte
            autor="W3C"
            obra="WCAG 2.2, critérios 1.4.3, 2.1.1, 2.4.7, 2.5.5 e 2.3.3"
            ano="2023"
            href="https://www.w3.org/TR/WCAG22/"
          />

          <h2 className="mt-14 font-display text-2xl font-semibold">
            O que este site não é
          </h2>
          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Não substitui advogado nem banco e não garante devolver dinheiro.
            Se uma página pedir CPF, senha ou pagamento, não é dos Hackudinhos.
          </p>

          <div className="mt-12 border-t border-chumbo-linha pt-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/no-trabalho"
                className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
              >
                Golpes no trabalho →
              </Link>
              <Link
                href="/contato"
                className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linha px-5 py-3 font-display text-sm text-papel-2 transition-colors duration-200 hover:text-papel"
              >
                Falar com a equipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
