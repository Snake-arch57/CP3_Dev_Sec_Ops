import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Treinamento",
  description:
    "Jogo que ensina a reconhecer e-mails de golpe. O acesso vem da empresa.",
};

/**
 * Porta para a plataforma gamificada.
 *
 * O jogo roda em outro domínio, com identidade visual própria — pixel art, em
 * vez do laudo técnico do site. Isso é proposital, e a página avisa: o
 * visitante não deve achar que entrou no lugar errado.
 *
 * Não existe um segundo login aqui. A autenticação é da plataforma, com cookie
 * de sessão no domínio dela; duplicar a tela criaria duas sessões e nenhuma
 * vantagem.
 */
/**
 * Para onde o botão de entrar leva.
 *
 * O padrão aponta para o deploy na Vercel, que é o que recebe as atualizações.
 * Havia aqui um endereço em servidor próprio (`play.mizanis.com.br`) que segue
 * no ar servindo uma versão anterior — quem chegava pelo site via a identidade
 * antiga, e quem entrava pela Vercel via a nova. Duas caras para o mesmo
 * produto.
 *
 * `NEXT_PUBLIC_JOGO_URL` continua sobrescrevendo, para quando houver um
 * subdomínio próprio (algo como jogo.hackudinhos.com.br) sem precisar de
 * alteração de código.
 */
const URL_JOGO =
  process.env.NEXT_PUBLIC_JOGO_URL ?? "https://cyber-guard-jogo.vercel.app";

const O_QUE_TEM = [
  {
    titulo: "Uma caixa de e-mails para conferir",
    texto: "A cada fase, você separa os e-mails verdadeiros dos falsos.",
  },
  {
    titulo: "Pontos e fases",
    texto:
      "Cada acerto vale pontos. Assim você cria o hábito de conferir antes de clicar.",
  },
  {
    titulo: "Ranking entre colegas",
    texto: "O placar dá motivo para jogar de novo.",
  },
];

export default function TreinamentoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plataforma"
        title="A trilha de treinamento"
        description="O site explica os golpes. O jogo ajuda você a reconhecê-los."
      />

      <section className="py-14 md:py-20">
        <div className="container-read">
          {/* Sem isto, a pessoa clica, cai numa tela de login sem cadastro e
              acha que o site quebrou. */}
          <div className="rounded-sm border border-menta/40 bg-menta-900/40 p-6">
            <p className="font-display text-xs font-medium uppercase tracking-etiqueta text-menta">
              Antes de clicar
            </p>
            <p className="mt-3 text-body leading-relaxed text-papel text-pretty">
              A plataforma <strong className="font-semibold">não tem cadastro aberto</strong>.
              Quem cuida do programa na empresa entrega seu usuário e uma senha
              provisória. Não recebeu? Este site já ensina o essencial. Comece
              pela{" "}
              <Link
                href="/agora"
                className="underline decoration-menta/50 underline-offset-4 hover:decoration-menta"
              >
                lista de oito ajustes
              </Link>
              .
            </p>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold">
              O que tem lá dentro
            </h2>
            <dl className="mt-8 divide-y divide-chumbo-linha border-y border-chumbo-linha">
              {O_QUE_TEM.map((item) => (
                <div key={item.titulo} className="py-6">
                  <dt className="font-display text-lg font-semibold">
                    {item.titulo}
                  </dt>
                  <dd className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                    {item.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* A troca de identidade visual precisa ser anunciada, senão parece
              que o link levou para outro produto por engano. */}
          <p className="mt-10 border-l-2 border-chumbo-linhaForte py-1 pl-5 text-body leading-relaxed text-papel-3 text-pretty">
            De propósito, o jogo tem um visual bem diferente daqui.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`${URL_JOGO}/login`}
              className="inline-flex min-h-touch items-center rounded-sm bg-menta px-6 py-3 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-menta-400"
            >
              Entrar no treinamento →
            </a>
            <Link
              href="/golpe"
              className="inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-6 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Antes, testar de graça aqui
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
