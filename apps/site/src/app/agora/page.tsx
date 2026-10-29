import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { Checklist } from "./Checklist";

export const metadata: Metadata = {
  title: "O que fazer agora",
  description:
    "Oito ajustes simples contra golpes.",
};

export default function AgoraPage() {
  return (
    <>
      <PageHeader
        numero="05"
        eyebrow="O que fazer agora"
        title="Oito ajustes simples de segurança"
        description="Nenhum exige saber de tecnologia."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "Ligue a verificação em duas etapas, a começar pelo e-mail.",
              "Use um gerenciador de senhas e não repita senha.",
              "Coloque senha no chip do celular.",
              "Combine com a família uma palavra-código para pedidos de dinheiro por telefone.",
            ]}
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-read">
          <Checklist />

          <TermosRelacionados
            ids={[
              "2fa",
              "gerenciador-de-senhas",
              "frase-senha",
              "chave-pix",
            ]}
          />
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Nada disso garante tudo</p>
          <p className="mt-4 text-body text-papel-2 text-pretty">
            Alguns golpes passam mesmo assim. Se acontecer, a culpa não é sua.
            Estes ajustes diminuem a chance e o prejuízo.
          </p>

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              Já aconteceu com você? Veja a próxima página.
            </p>
            <Link
              href="/ja-cai"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm bg-ambar px-5 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-[#F5BB63]"
            >
              Já caí num golpe — e agora? →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
