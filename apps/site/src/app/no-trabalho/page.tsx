import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Essencial } from "@/components/ui/Essencial";
import { Aprofundar } from "@/components/ui/Aprofundar";
import { TermosRelacionados } from "@/components/ui/TermosRelacionados";
import { Fonte } from "@/components/ui/Fonte";
import { CATEGORIAS, PASSOS_INCIDENTE, TOTAL_GOLPES } from "@/lib/trabalho";

export const metadata: Metadata = {
  title: "Os mesmos golpes no trabalho",
  description:
    "Golpes que miram quem está trabalhando: QR Code trocado, login falso, boleto trocado e mais. Veja como barrar cada um.",
};

const MEDOS = [
  {
    medo: "“Vão achar que sou burro.”",
    real: "Golpista treina isso todo dia. Cair não tem nada a ver com inteligência.",
  },
  {
    medo: "“Vou levar bronca.”",
    real: "Avisar é sempre o certo. Esconder dá mais prejuízo, e uma hora aparece.",
  },
  {
    medo: "“Talvez não tenha sido nada, não quero dar trabalho.”",
    real: "Alarme falso custa dez minutos de alguém. Aviso atrasado pode custar dias de trabalho parado.",
  },
  {
    medo: "“Vou esperar para ver se dá problema.”",
    real: "É a pior escolha. Logo no começo, dá para bloquear acesso e cancelar pagamento. Depois, só resta contar o prejuízo.",
  },
];

export default function NoTrabalhoPage() {
  return (
    <>
      <PageHeader
        eyebrow="No trabalho · Challenge Leroy Merlin"
        title="Os mesmos golpes, quando você está no trabalho"
        description="O jeito de enganar é o mesmo. Mas no trabalho o dinheiro é da empresa, e o prejuízo atinge clientes e colegas."
      />

      <section className="pt-10 md:pt-12">
        <div className="container-read">
          <Essencial
            itens={[
              "No trabalho, o golpe mira pagamentos, senhas e fornecedores.",
              "Caiu? Avise na hora. Quem tem medo de avisar deixa o problema crescer.",
              "Se vazar dado de cliente, a empresa tem poucos dias para avisar o governo e as pessoas.",
            ]}
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          <div className="mb-12 max-w-2xl border-l-2 border-chumbo-linha pl-5">
            <p className="text-body text-papel-2 text-pretty">
              Quem cai não é descuidado. É quem estava com pressa, fazendo três
              coisas ao mesmo tempo. Isso acontece com todo mundo.
            </p>
          </div>

          {/* Índice: com vários golpes, uma lista corrida vira parede de texto. */}
          <nav aria-label="Categorias" className="mb-14">
            <p className="etiqueta">
              {TOTAL_GOLPES} golpes, em três grupos
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIAS.map((c) => (
                <li key={c.id}>
                  {/* A contagem vai à direita: à esquerda ela era lida como
                      número de ordem, igual às seções 01–06 do site. */}
                  <a
                    href={`#${c.id}`}
                    className="flex min-h-touch items-center justify-between gap-3 rounded-sm border border-chumbo-linha px-4 font-display text-sm text-papel-2 transition-colors duration-200 hover:border-menta hover:text-menta"
                  >
                    {c.titulo}
                    <span className="shrink-0 text-xs text-papel-3">
                      {`${c.golpes.length} golpes`}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16">
            {CATEGORIAS.map((cat) => (
              <section
                key={cat.id}
                id={cat.id}
                className="scroll-mt-24"
                aria-labelledby={`titulo-${cat.id}`}
              >
                <h2
                  id={`titulo-${cat.id}`}
                  className="font-display text-2xl font-semibold text-balance md:text-3xl"
                >
                  {cat.titulo}
                </h2>
                <p className="mt-3 max-w-2xl text-body text-papel-2 text-pretty">
                  {cat.resumo}
                </p>

                <ul className="mt-8 space-y-px bg-chumbo-linha">
                  {cat.golpes.map((g) => (
                    <li key={g.id} className="bg-chumbo py-8 md:px-6">
                      <h3 className="font-display text-xl font-semibold text-balance">
                        {g.titulo}
                      </h3>

                      {/*
                        Dos quatro textos de cada golpe, três ficam visíveis
                        (como chega, onde o golpe quebra, o que fazer) e só "por
                        que funciona" fica recolhido. Os três visíveis são o que
                        faz reconhecer e agir; o recolhido é para quem quer
                        entender a fundo, sem pesar na leitura de quem só quer o
                        recado.
                      */}
                      <div className="mt-5">
                        <p className="etiqueta">Como chega</p>
                        <p className="mt-2 text-sm leading-relaxed text-papel-2">
                          {g.comoChega}
                        </p>
                      </div>

                      <div className="mt-5 border-l-2 border-menta py-2 pl-4">
                        <p className="etiqueta-risco">Onde você barra o golpe</p>
                        <p className="mt-1.5 text-body leading-relaxed text-papel text-pretty">
                          {g.pontoDeQuebra}
                        </p>
                      </div>

                      <div className="mt-5">
                        <p className="etiqueta">O que fazer</p>
                        <p className="mt-2 text-sm leading-relaxed text-papel-2">
                          {g.oQueFazer}
                        </p>
                      </div>

                      <div className="mt-4">
                        <Aprofundar rotulo="Por que funciona">
                          <p className="text-sm leading-relaxed text-papel-2">
                            {g.porQueFunciona}
                          </p>
                        </Aprofundar>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Correção de um mito que aparecia na versão anterior deste site. */}
      <section className="border-y border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta-risco">
            Uma correção sobre Wi-Fi público
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-balance">
            O risco do Wi-Fi aberto mudou
          </h2>
          <p className="mt-5 text-body leading-relaxed text-papel-2 text-pretty">
            Antes, quem estava na mesma rede podia ler o que você enviava.
            Hoje quase todo site protege esses dados.
          </p>
          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            O risco hoje é outro. Pode ser uma rede falsa com o nome da loja ou
            do shopping, que abre um login falso. Pode ser um cadastro pedindo
            CPF e telefone. Ou alguém olhando a sua tela.
          </p>
          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            Prefira o 4G ou 5G do celular. Nunca digite senha numa tela que
            abriu sozinha ao conectar. Para sistema da empresa, use a VPN da
            empresa, a conexão protegida que ela fornece.
          </p>
        </div>
      </section>

      {/* Cultura de reporte — a parte que quase nenhum material corporativo tem. */}
      <section className="py-14 md:py-20">
        <div className="container-read">
          <p className="etiqueta">Contragolpe</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance md:text-3xl">
            Avisar rápido é a melhor defesa
          </h2>

          <p className="mt-5 text-bodyLg leading-relaxed text-papel-2 text-pretty">
            O estrago depende do tempo até alguém saber. No começo, dá para
            bloquear um acesso, parar um pagamento ou desconectar o computador.
          </p>

          <p className="mt-4 text-body leading-relaxed text-papel-2 text-pretty">
            O que mais atrasa o aviso é a vergonha. Veja as quatro frases que
            passam pela cabeça de quem clicou errado:
          </p>

          <dl className="mt-8 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {MEDOS.map((m) => (
              <div key={m.medo} className="py-5">
                <dt className="font-display text-base text-papel">{m.medo}</dt>
                <dd className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                  {m.real}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border-l-2 border-menta py-2 pl-5">
            <p className="etiqueta text-menta">
              Se você lidera uma equipe
            </p>
            <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
              Sua reação ao primeiro aviso decide se haverá um segundo. Quem
              leva bronca por avisar para de contar. Agradeça o aviso, mesmo
              quando for alarme falso.
            </p>
          </div>
        </div>
      </section>

      {/* Resposta a incidente. */}
      <section className="border-t border-chumbo-linha bg-chumbo-painel/40 py-14 md:py-20">
        <div className="container-read">
          <h2 className="font-display text-2xl font-semibold">
            Se acontecer com você no trabalho
          </h2>
          <p className="mt-3 text-body text-papel-2 text-pretty">
            Siga os passos nesta ordem.
          </p>

          <ol className="mt-8 divide-y divide-chumbo-linha border-y border-chumbo-linha">
            {PASSOS_INCIDENTE.map((i) => (
              <li key={i.n} className="py-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-display text-sm font-semibold text-menta">
                    {i.n}
                  </span>
                  <span className="etiqueta">{i.quando}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-balance">
                  {i.titulo}
                </h3>
                <p className="mt-2 text-body leading-relaxed text-papel-2 text-pretty">
                  {i.texto}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-sm border border-chumbo-linha bg-chumbo-painel p-6">
            <p className="etiqueta">O prazo da lei</p>
            <p className="mt-3 text-body leading-relaxed text-papel-2 text-pretty">
              Um problema de segurança atingiu dados pessoais e pode trazer
              risco relevante às pessoas? A empresa tem{" "}
              <strong className="font-semibold text-papel">
                três dias úteis
              </strong>{" "}
              para avisar a ANPD e as pessoas afetadas. A ANPD é o órgão do
              governo que cuida de dados pessoais. O prazo conta de quando a
              empresa descobre que dados pessoais foram atingidos.
            </p>
            <p className="mt-3 text-body leading-relaxed text-papel-2 text-pretty">
              Por isso seu aviso rápido ajuda a empresa a cumprir a lei. Quem
              faz esse aviso é o encarregado de dados, nunca você por conta
              própria.
            </p>
            <Fonte
              autor="ANPD"
              obra="Resolução CD/ANPD nº 15, Regulamento de Comunicação de Incidente de Segurança"
              ano="2024"
              href="https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca"
            />
          </div>

          <TermosRelacionados
            ids={[
              "phishing",
              "engenharia-social",
              "malware",
              "lgpd",
            ]}
          />

          <div className="mt-10 border-t border-chumbo-linha pt-8">
            <p className="text-body text-papel-2">
              Fora do trabalho, o alvo é você e sua família. E o golpe é o
              mesmo.
            </p>
            <Link
              href="/golpe"
              className="mt-5 inline-flex min-h-touch items-center rounded-sm border border-chumbo-linhaForte px-5 py-3 font-display text-sm text-papel transition-colors duration-200 hover:border-menta hover:text-menta"
            >
              Voltar para os golpes do dia a dia →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
