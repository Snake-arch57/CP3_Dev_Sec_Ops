import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendenteVerificacao } from "@/components/ui/Fonte";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";

export const metadata: Metadata = {
  title: "Já caí num golpe — e agora?",
  description:
    "O que fazer depois de cair num golpe.",
};

type Passo = {
  n: string;
  quando: string;
  titulo: string;
  texto: string;
  detalhe?: string;
};

const PASSOS: Passo[] = [
  {
    n: "01",
    quando: "nos primeiros minutos",
    titulo: "Ligue para o banco e peça o bloqueio",
    texto:
      "Use o número do verso do cartão ou o chat do app. Nunca use número que veio na mensagem. Diga: “fui vítima de fraude, quero registrar contestação e acionar o Mecanismo Especial de Devolução”.",
    detalhe:
      "Esse mecanismo (MED) é uma regra do Banco Central que tenta trazer o PIX de volta. Você tem até 80 dias para pedir, e o banco, até 7 dias para analisar. Peça no mesmo dia: o dinheiro some rápido.",
  },
  {
    n: "02",
    quando: "nos primeiros minutos",
    titulo: "Tomaram seu WhatsApp? Recupere agora",
    texto:
      "Instale o WhatsApp de novo e entre com seu número. O código chega por SMS. O golpista perde o acesso na hora.",
    detalhe:
      "Depois, ligue a confirmação em duas etapas no WhatsApp. O app pediu um PIN que você não criou? Foi o golpista. Recupere por e-mail ou espere sete dias.",
  },
  {
    n: "03",
    quando: "na primeira hora",
    titulo: "Avise seus contatos por outro caminho",
    texto:
      "Ligue ou poste nos stories. Diga: “meu WhatsApp foi clonado, não mandem PIX para ninguém que se diga eu”.",
    detalhe: "Assim, amigos e parentes não caem no mesmo golpe.",
  },
  {
    n: "04",
    quando: "no mesmo dia",
    titulo: "Registre boletim de ocorrência",
    texto:
      "É de graça, pela internet, na delegacia eletrônica do seu estado. Entre com a conta gov.br. Vale como o da delegacia.",
    detalhe:
      "O banco costuma pedir o número do BO. Ele também ajuda se abrirem crédito no seu nome.",
  },
  {
    n: "05",
    quando: "no mesmo dia",
    titulo: "Troque as senhas, começando pelo e-mail",
    texto:
      "Com seu e-mail, dá para trocar todas as outras senhas. Depois, troque as do banco, das redes e as repetidas.",
    detalhe:
      "Em cada conta, procure “aparelhos conectados” e desconecte o que não reconhece. Senão, o golpista pode continuar lá dentro.",
  },
  {
    n: "06",
    quando: "nos primeiros dias",
    titulo: "Veja o que existe no seu nome",
    texto:
      "O Registrato, do Banco Central, mostra de graça as contas, empréstimos e chaves PIX no seu CPF.",
  },
  {
    n: "07",
    quando: "se não resolver",
    titulo: "Reclame no canal oficial",
    texto:
      "O banco negou sem explicar ou não respondeu? Reclame no Consumidor.gov.br. Se passaram seu número para outro chip, reclame também na Anatel.",
  },
];

type Canal = {
  nome: string;
  o_que: string;
  href?: string;
  rotulo?: string;
  pendente?: string;
};

const CANAIS: Canal[] = [
  {
    nome: "Seu banco",
    o_que:
      "Para pedir a devolução do PIX (MED). É o canal mais importante.",
    rotulo: "Use o número do verso do cartão ou o chat do app.",
  },
  {
    nome: "Delegacia eletrônica de São Paulo",
    o_que: "Boletim pela internet, com login gov.br.",
    href: "https://www.delegaciaeletronica.policiacivil.sp.gov.br/",
  },
  {
    nome: "Delegacia eletrônica dos demais estados",
    o_que: "Cada estado tem seu próprio site.",
    pendente:
      "Busque “delegacia eletrônica” e o nome do seu estado. Só digite dados se o endereço do site terminar em .gov.br.",
  },
  {
    nome: "Registrato — Banco Central",
    o_que: "Relatório gratuito do seu CPF. Entre com a conta gov.br.",
    href: "https://www.gov.br/pt-br/servicos/emitir-relatorio-de-chaves-pix",
  },
  {
    nome: "Consumidor.gov.br",
    o_que:
      "Do Ministério da Justiça, para reclamar de empresa que não resolveu. Ela tem dez dias para responder.",
    href: "https://www.consumidor.gov.br",
  },
  {
    nome: "Anatel",
    o_que:
      "Para reclamar da operadora, se passaram seu número para outro chip. Antes, reclame na operadora e anote o protocolo.",
    href: "https://www.gov.br/anatel/pt-br/consumidor/quer-reclamar/reclamacao",
  },
];

const NAO_FACA = [
  {
    titulo: "Não pague para “recuperar” o dinheiro",
    texto:
      "Quem cobra taxa para recuperar o dinheiro é outro golpista. Só o seu banco pode tentar isso.",
  },
  {
    titulo: "Não procure o telefone do banco na internet",
    texto:
      "Golpistas pagam anúncios com números falsos. Use só o verso do cartão ou o chat do app.",
  },
  {
    titulo: "Não apague as mensagens",
    texto:
      "Guarde prints, comprovante do PIX, número de quem chamou e horário.",
  },
  {
    titulo: "Não fique sozinho com isso",
    texto:
      "A vergonha atrasa você, e o golpe depende disso. Conte para alguém logo.",
  },
];

export default function JaCaiPage() {
  return (
    <>
      <PageHeader
        numero="06"
        eyebrow="Depois do golpe"
        title="Já caí num golpe — e agora?"
        description="Não é culpa sua: golpista é profissional. Agora, aja rápido e na ordem certa."
      />

      {/* Ação imediata, antes de qualquer leitura longa. */}
      <section className="border-b border-chumbo-linha bg-ambarDim/40 py-8">
        <div className="container-read">
          <p className="etiqueta-risco">Se acabou de acontecer</p>
          <p className="mt-3 text-bodyLg text-papel text-pretty">
            Ligue para o seu banco agora, pelo número do verso do cartão. Diga
            que foi vítima de fraude. Faça isso antes de ler o resto: a chance
            de recuperar o dinheiro cai a cada hora.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-read">
          <h2 className="font-display text-2xl font-semibold">
            As primeiras horas, em ordem
          </h2>

          <ol className="mt-10 space-y-10">
            {PASSOS.map((p) => (
              <li key={p.n} className="border-t border-chumbo-linha pt-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-display text-sm font-semibold text-menta">
                    {p.n}
                  </span>
                  <span className="etiqueta">{p.quando}</span>
                </div>

                <h3 className="mt-3 font-display text-xl font-semibold text-balance">
                  {p.titulo}
                </h3>
                <p className="mt-3 text-body leading-relaxed text-papel-2 text-pretty">
                  {p.texto}
                </p>
                {p.detalhe && (
                  <p className="mt-3 border-l-2 border-chumbo-linhaForte py-1 pl-4 text-sm leading-relaxed text-papel-3">
                    {p.detalhe}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <h2 className="font-display text-2xl font-semibold">O que não fazer</h2>
          <ul className="mt-8 space-y-6">
            {NAO_FACA.map((n) => (
              <li key={n.titulo} className="border-l-2 border-ambar pl-5">
                <h3 className="font-display text-lg font-semibold">{n.titulo}</h3>
                <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                  {n.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-chumbo-linha py-14 md:py-20">
        <div className="container-read">
          <h2 className="font-display text-2xl font-semibold">Canais oficiais</h2>
          <p className="mt-3 text-body text-papel-2 text-pretty">
            Só canais do governo e do seu banco.
          </p>

          <ul className="mt-8 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {CANAIS.map((c) => (
              <li key={c.nome} className="py-6">
                <h3 className="font-display text-lg font-semibold">{c.nome}</h3>
                <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                  {c.o_que}
                </p>

                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-touch items-center break-all font-display text-sm text-menta underline decoration-menta/40 underline-offset-4 transition-colors hover:decoration-menta"
                  >
                    {c.href.replace(/^https:\/\//, "")} ↗
                  </a>
                )}

                {c.rotulo && (
                  <p className="mt-3 text-sm leading-relaxed text-papel-3">
                    {c.rotulo}
                  </p>
                )}

                {c.pendente && (
                  <div className="mt-3">
                    <PendenteVerificacao>
                      link ainda não conferido
                    </PendenteVerificacao>
                    <p className="mt-2 text-sm leading-relaxed text-papel-3">
                      {c.pendente}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-display text-xs leading-relaxed text-papel-3">
            Os links acima foram conferidos.
          </p>

          <TermosRelacionados
            ids={[
              "med",
              "chave-pix",
              "registrato",
              "conta-gov-br",
            ]}
          />
        </div>
      </section>

      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="text-body text-papel-2 text-pretty">
            Passado o susto, proteja suas contas.
          </p>
          <Link
            href="/agora"
            className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
          >
            Veja os oito ajustes →
          </Link>
        </div>
      </section>
    </>
  );
}
