/**
 * Casos do "qual deles é golpe?".
 *
 * Todos são reconstruções de fraudes que circulam de verdade no Brasil,
 * escritas do zero. Nomes de banco e de empresa privada são fictícios de
 * propósito; onde aparece um serviço real (Correios, PIX), aparece porque a
 * fraude é conhecida por esse nome e reconhecer o nome é parte do aprendizado
 * — nunca como afirmação sobre a empresa.
 *
 * Um `Trecho` com `sinal` é um pedaço do texto que será destacado dentro da
 * própria mensagem depois da resposta, ancorado ao item de mesmo número na
 * legenda. É isso que diferencia esta seção de um quiz comum: o usuário vê
 * ONDE estava a pista, não só que errou.
 */

export type Trecho = string | { texto: string; sinal: number };

export type Sinal = {
  n: number;
  titulo: string;
  texto: string;
};

export type Campo = {
  rotulo: string;
  valor: Trecho[];
};

export type Mensagem = {
  id: string;
  canal: "sms" | "whatsapp" | "email";
  /** Rótulo do canal exibido no topo do cartão. */
  canalLabel: string;
  campos: Campo[];
  corpo: Trecho[][];
  golpe: boolean;
  sinais: Sinal[];
  /** Explicação exibida depois da resposta. */
  veredito: string;
};

export type Rodada = {
  id: string;
  titulo: string;
  contexto: string;
  mensagens: [Mensagem, Mensagem];
  /** Lição da rodada, mostrada depois da resposta. */
  licao: string;
};

export const RODADAS: Rodada[] = [
  {
    id: "entrega",
    titulo: "Duas mensagens sobre uma encomenda",
    contexto: "Você comprou algo pela internet. Uma destas mensagens é golpe.",
    licao:
      "Aviso de entrega verdadeiro não cobra. Apareceu taxa? Confira no app ou no site da loja.",
    mensagens: [
      {
        id: "entrega-golpe",
        canal: "sms",
        canalLabel: "SMS",
        campos: [
          {
            rotulo: "De",
            valor: [{ texto: "+55 11 9 7xxx-xxxx", sinal: 1 }],
          },
        ],
        corpo: [
          [
            "CORREIOS: sua encomenda está retida por taxa alfandegária de ",
            { texto: "R$ 3,79", sinal: 2 },
            ". Pague ",
            { texto: "até hoje às 18h", sinal: 3 },
            " ou o pacote volta ao remetente: ",
            { texto: "correios-rastreio.info/taxa", sinal: 4 },
          ],
        ],
        golpe: true,
        sinais: [
          {
            n: 1,
            titulo: "Veio de um celular comum",
            texto: "Empresa grande manda SMS de número curto, não de celular.",
          },
          {
            n: 2,
            titulo: "Valor baixo de propósito",
            texto: "Você paga sem pensar. Eles querem o seu cartão.",
          },
          {
            n: 3,
            titulo: "Pressa inventada",
            texto: "O prazo curto é para você não conferir.",
          },
          {
            n: 4,
            titulo: "Site falso",
            texto: "O site dos Correios termina em correios.com.br. Este não.",
          },
        ],
        veredito: "Golpe clássico da taxa de entrega.",
      },
      {
        id: "entrega-legitima",
        canal: "sms",
        canalLabel: "SMS",
        campos: [{ rotulo: "De", valor: ["28908"] }],
        corpo: [
          [
            "Seu objeto AA123456789BR saiu para entrega hoje. Acompanhe pelo aplicativo dos Correios.",
          ],
        ],
        golpe: false,
        sinais: [
          {
            n: 1,
            titulo: "Só informa",
            texto: "Não pede dinheiro nem dados.",
          },
          {
            n: 2,
            titulo: "Manda para o app, sem link",
            texto: "Você chega por um caminho que já conhece.",
          },
        ],
        veredito: "Legítima. Mesmo assim, confira pelo app.",
      },
    ],
  },

  {
    id: "whatsapp",
    titulo: "Duas mensagens da sua irmã no WhatsApp",
    contexto: "As duas chegaram hoje. Uma não é quem diz ser.",
    licao:
      "Pediram dinheiro por mensagem? Ligue para o número antigo da pessoa. Quem clonou a conta não atende.",
    mensagens: [
      {
        id: "wpp-golpe",
        canal: "whatsapp",
        canalLabel: "WhatsApp",
        campos: [
          {
            rotulo: "Contato",
            valor: [
              { texto: "Número desconhecido", sinal: 1 },
              " · foto de perfil igual à da sua irmã",
            ],
          },
        ],
        corpo: [
          [
            "Oi, tudo bem? ",
            { texto: "Troquei de número, salva aí", sinal: 2 },
            " 🙂",
          ],
          [
            "Me faz um favor? Preciso pagar uma coisa agora e ",
            { texto: "meu app do banco está fora do ar", sinal: 3 },
            ".",
          ],
          [
            "São R$ 1.870. ",
            { texto: "A chave PIX é de um amigo meu", sinal: 4 },
            ", depois te explico. ",
            { texto: "Não me liga que estou em reunião", sinal: 5 },
            ", me avisa quando cair.",
          ],
        ],
        golpe: true,
        sinais: [
          {
            n: 1,
            titulo: "Número novo, foto conhecida",
            texto: "Copiar foto e nome leva segundos.",
          },
          {
            n: 2,
            titulo: "“Troquei de número”",
            texto: "Pode ser verdade. Confirme ligando no número antigo.",
          },
          {
            n: 3,
            titulo: "Desculpa para você pagar",
            texto: "Sempre há um motivo para ser você, e agora.",
          },
          {
            n: 4,
            titulo: "PIX para outra pessoa",
            texto: "O sinal mais forte. Antes de confirmar o PIX, leia no app o nome de quem vai receber.",
          },
          {
            n: 5,
            titulo: "Pede para não ligar",
            texto: "A voz desmascara o golpe na hora.",
          },
        ],
        veredito: "Golpe do WhatsApp clonado. Só funciona se você não ligar.",
      },
      {
        id: "wpp-legitima",
        canal: "whatsapp",
        canalLabel: "WhatsApp",
        campos: [
          {
            rotulo: "Contato",
            valor: ["Irmã · número salvo há 6 anos"],
          },
        ],
        corpo: [
          ["Oiii, chegou o convite do casamento da Bia aí?"],
          ["Se não chegou eu levo domingo quando eu for aí"],
        ],
        golpe: false,
        sinais: [
          {
            n: 1,
            titulo: "Não pede nada",
            texto: "Sem dinheiro, código ou pressa.",
          },
          {
            n: 2,
            titulo: "Detalhe da vida real",
            texto: "Golpista não conhece a sua vida.",
          },
        ],
        veredito: "Legítima. É só a sua irmã.",
      },
    ],
  },


  {
    id: "emprego",
    titulo: "Duas mensagens sobre uma vaga",
    contexto: "Você pôs seu currículo em sites de emprego.",
    licao:
      "Vaga de verdade não cobra nada. E não pede dados do banco antes de contratar.",
    mensagens: [
      {
        id: "emprego-golpe",
        canal: "whatsapp",
        canalLabel: "WhatsApp",
        campos: [
          {
            rotulo: "Contato",
            valor: [{ texto: "Número desconhecido · +55 61 9 8xxx-xxxx", sinal: 1 }],
          },
        ],
        corpo: [
          [
            "Olá! Vimos seu currículo. Vaga de ",
            { texto: "assistente home office, R$ 2.400 por 4h/dia", sinal: 2 },
            ", sem experiência.",
          ],
          [
            { texto: "Você foi pré-aprovada!", sinal: 3 },
            " Falta só o ",
            { texto: "exame admissional (R$ 89,90)", sinal: 4 },
            ", reembolsado depois.",
          ],
          [
            { texto: "Só 2 vagas, fecham hoje", sinal: 3 },
            ". Me manda ",
            { texto: "CPF e dados da conta", sinal: 5 },
            "?",
          ],
        ],
        golpe: true,
        sinais: [
          {
            n: 1,
            titulo: "Chegou pelo WhatsApp",
            texto: "Empresa séria usa o site da vaga ou um e-mail com o nome da empresa.",
          },
          {
            n: 2,
            titulo: "Bom demais",
            texto: "É isca para quem precisa de emprego.",
          },
          {
            n: 3,
            titulo: "Aprovada e com pressa",
            texto: "Sem entrevista, ninguém é aprovado.",
          },
          {
            n: 4,
            titulo: "Cobra do candidato",
            texto: "Por lei, o exame é pago pela empresa.",
          },
          {
            n: 5,
            titulo: "Dados bancários cedo",
            texto: "Podem ser usados para pegar crédito no seu nome.",
          },
        ],
        veredito: "Golpe do falso emprego.",
      },
      {
        id: "emprego-legitimo",
        canal: "email",
        canalLabel: "E-mail",
        campos: [
          {
            rotulo: "De",
            valor: ["Recrutamento Vega <selecao@vega.com.br>"],
          },
          { rotulo: "Assunto", valor: ["Candidatura: assistente administrativo"] },
        ],
        corpo: [
          ["Olá, Marina. Recebemos sua candidatura."],
          ["Escolha o horário da entrevista no site onde você se inscreveu."],
          ["Não cobramos nada e não pedimos dados bancários antes de contratar."],
        ],
        golpe: false,
        sinais: [
          {
            n: 1,
            titulo: "Etapa clara",
            texto: "Você entra pelo site, não por link recebido.",
          },
          {
            n: 2,
            titulo: "Diz que não cobra",
            texto: "Pediu dinheiro depois? Não é essa empresa.",
          },
        ],
        veredito: "Legítima.",
      },
    ],
  },
];
