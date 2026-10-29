import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { LinhaDoTempo } from "./LinhaDoTempo";

export const metadata: Metadata = {
  title: "Como o golpe funciona por dentro",
  description:
    "Clonagem de WhatsApp passo a passo, e como se proteger.",
};

export default function AnatomiaPage() {
  return (
    <>
      <PageHeader
        numero="03"
        eyebrow="Anatomia de um golpe"
        title="Clonagem de WhatsApp, passo a passo"
        description="Veja onde dá para parar cada etapa."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "O golpe tem etapas. Dá para parar em cada uma.",
              "Ninguém invade nada. O golpista engana você numa conversa.",
              "Sabendo como funciona, você reconhece até golpe novo.",
            ]}
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-14 max-w-2xl border-l-2 border-chumbo-linha pl-5">
            <p className="text-body text-papel-2 text-pretty">
              Apesar do nome, ninguém copia seu celular. O golpista só te
              convence a contar um código que o WhatsApp mandou.
            </p>
          </div>

          <LinhaDoTempo />

          <div className="container-read px-0">
            <TermosRelacionados
              ids={[
                "engenharia-social",
                "sim-swap",
                "2fa",
                "chave-pix",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta-risco">
            Se for fazer só uma coisa
          </p>
          <p className="mt-4 text-bodyLg text-papel text-pretty">
            Ative a verificação em duas etapas do WhatsApp. Você cria um PIN de
            seis dígitos. Ele trava o golpe no passo 05, mesmo se
            alguém tiver o código.
          </p>
          <p className="mt-4 text-body text-papel-2 text-pretty">
            No app: Configurações → Privacidade → Verificação em duas etapas →
            Ativar. Guarde o PIN com seus documentos. Cadastre um e-mail de
            recuperação: sem ele, quem esquece o PIN espera sete dias para voltar à conta.
          </p>

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              Esse golpe é antigo. Agora ficou mais barato fazer ele parecer
              verdade.
            </p>
            <Link
              href="/ia"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Próximo · O que a IA mudou →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
