import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { Fonte } from "@/components/ui/Fonte";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { TesteSenha } from "./TesteSenha";

export const metadata: Metadata = {
  title: "Teste sua senha",
  description:
    "Veja quanto tempo levaria para descobrir sua senha. Nada é enviado.",
};

export default function SenhaPage() {
  return (
    <>
      <PageHeader
        numero="01"
        eyebrow="Teste de senha"
        title="Quanto tempo a sua senha aguenta?"
        description="Digite uma senha inventada e veja."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "Senha previsível cai primeiro: nome, data e sequência.",
              "Tamanho vale mais que símbolos. Quatro palavras sorteadas vencem P@ssw0rd!",
              "O teste roda no seu navegador. Nada é gravado.",
            ]}
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          <TesteSenha />

          <TermosRelacionados
            ids={[
              "gerenciador-de-senhas",
              "frase-senha",
              "vazamento",
              "2fa",
            ]}
          />
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Não precisa trocar a senha por rotina</p>
          <p className="mt-4 text-body text-papel-2 text-pretty">
            O NIST, referência mundial no assunto, parou de recomendar a troca
            obrigatória de senha. Ela faz as pessoas criarem senhas parecidas.
            Troque só se suspeitar de invasão.
          </p>
          <Fonte
            autor="NIST"
            obra="SP 800-63B, Digital Identity Guidelines"
            ano="2017, rev. 2024"
            href="https://pages.nist.gov/800-63-3/sp800-63b.html"
          />

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              Senha forte não basta se alguém convencer você a entregá-la.
            </p>
            <Link
              href="/golpe"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Próximo · Qual deles é golpe? →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
