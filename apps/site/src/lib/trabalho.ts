/**
 * Conteúdo da camada corporativa (`/no-trabalho`).
 *
 * Padrão de cada golpe, e ele não deve ser quebrado ao adicionar um novo:
 *
 *   comoChega       o que a pessoa vê acontecer
 *   porQueFunciona  qual gatilho psicológico ou falha de processo é explorado
 *   pontoDeQuebra   o momento exato em que a corrente arrebenta
 *   oQueFazer       a ação concreta, em uma ou duas frases
 *
 * O `pontoDeQuebra` é o campo que diferencia este material de uma lista de
 * boas práticas. Todo golpe é uma sequência de passos, e quase sempre existe
 * um único elo que, rompido, derruba o resto — nomear esse elo é mais útil do
 * que pedir atenção genérica.
 */

export type GolpeTrabalho = {
  id: string;
  titulo: string;
  comoChega: string;
  porQueFunciona: string;
  pontoDeQuebra: string;
  oQueFazer: string;
};

export type Categoria = {
  id: string;
  titulo: string;
  resumo: string;
  golpes: GolpeTrabalho[];
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "identidade",
    titulo: "Quem finge ser da empresa",
    resumo:
      "Usam o cargo, a pressa e a vergonha de desconfiar de um chefe ou colega.",
    golpes: [
      {
        id: "falso-ti",
        titulo: "O falso suporte de TI",
        comoChega:
          "Alguém liga dizendo ser da TI e pede sua senha ou um código, com urgência.",
        porQueFunciona:
          "Dizer não parece falta de colaboração.",
        pontoDeQuebra:
          "Quando pedem senha ou código. A TI de verdade não precisa disso.",
        oQueFazer:
          "Desligue. Ligue de volta pelo ramal da lista interna, não pelo número que ligou para você. Nunca aprove no celular um login que você não pediu.",
      },
      {
        id: "diretoria",
        titulo: "O pedido urgente da diretoria",
        comoChega:
          "Um e-mail ou WhatsApp em nome de um diretor pede um pagamento urgente e em segredo.",
        porQueFunciona:
          "Ninguém quer atrasar a diretoria.",
        pontoDeQuebra:
          "Na ligação para o número do diretor que você já tinha.",
        oQueFazer:
          "Só pague depois de ligar para a pessoa, no número que você já tinha. Nunca use o número da mensagem.",
      },
    ],
  },
  {
    id: "dinheiro",
    titulo: "Dinheiro que vai para a conta errada",
    resumo:
      "Trocam a conta de destino num lugar onde ninguém confere.",
    golpes: [
      {
        id: "boleto",
        titulo: "O boleto do fornecedor trocado",
        comoChega:
          "Um fornecedor conhecido manda a cobrança de sempre, mas com outra conta: “trocamos de banco”.",
        porQueFunciona:
          "O e-mail do fornecedor pode ter sido invadido.",
        pontoDeQuebra:
          "Na ligação para o número antigo do fornecedor. O golpista não atende esse telefone.",
        oQueFazer:
          "Confirme pelo telefone já cadastrado, nunca pelo que veio no e-mail.",
      },
      {
        id: "qr-code",
        titulo: "O QR Code trocado",
        comoChega:
          "Colam outro QR Code por cima do original, na maquininha ou num cartaz. O dinheiro vai para o golpista.",
        porQueFunciona:
          "Ninguém lê um QR Code a olho nu.",
        pontoDeQuebra:
          "Na tela do pagamento, que mostra quem vai receber. Se não for a loja, não pague.",
        oQueFazer:
          "Confira os QR Codes da loja no começo e no fim do dia. Oriente o cliente a ver quem recebe antes de confirmar.",
      },
    ],
  },
  {
    id: "acesso",
    titulo: "Senha, computador e dados de cliente",
    resumo:
      "Sua conta e o computador da loja abrem dados de clientes. Por isso valem muito.",
    golpes: [
      {
        id: "login-falso",
        titulo: "A página falsa de login",
        comoChega:
          "Um e-mail fala de holerite ou senha vencendo. O link abre uma cópia da tela de login da empresa.",
        porQueFunciona:
          "O assunto parece rotina.",
        pontoDeQuebra:
          "No endereço do site, antes de digitar a senha.",
        oQueFazer:
          "Nunca entre por link recebido. Use o atalho que você salvou.",
      },
      {
        id: "anexo",
        titulo: "O anexo que instala vírus",
        comoChega:
          "Chega um orçamento ou currículo. O arquivo pede para “habilitar conteúdo”.",
        porQueFunciona:
          "O botão parece só um passo chato.",
        pontoDeQuebra:
          "No botão de habilitar, que libera o vírus.",
        oQueFazer:
          "Na dúvida, não abra: mande para a TI. Se tudo travar e pedirem dinheiro, tire o cabo de rede, desligue o Wi-Fi, avise a TI e não pague.",
      },
    ],
  },
];

/** Total de golpes cobertos, calculado para não desatualizar no texto. */
export const TOTAL_GOLPES = CATEGORIAS.reduce(
  (soma, c) => soma + c.golpes.length,
  0,
);

export const PASSOS_INCIDENTE = [
  {
    n: "01",
    quando: "nos primeiros minutos",
    titulo: "Avise antes de tentar consertar",
    texto:
      "Quanto antes você avisa, menor o estrago. Ligue para a segurança ou para o seu líder.",
  },
  {
    n: "02",
    quando: "junto com o aviso",
    titulo: "Desconecte a máquina e conte tudo",
    texto:
      "Tire o cabo de rede e desligue o Wi-Fi. Conte tudo, até a parte que dá vergonha.",
  },
  {
    n: "03",
    quando: "antes de qualquer limpeza",
    titulo: "Não apague nada",
    texto:
      "Nem o e-mail, nem o arquivo, nem a mensagem. A segurança precisa deles para investigar.",
  },
  {
    n: "04",
    quando: "ainda no mesmo dia",
    titulo: "Anote o que aconteceu",
    texto:
      "Quando chegou, quando você clicou, quando percebeu e com quem falou. A memória falha rápido.",
  },
  {
    n: "05",
    quando: "com orientação da TI",
    titulo: "Troque as senhas envolvidas",
    texto:
      "Troque em todo lugar que usava a mesma senha, até nas contas pessoais. Depois, desconecte a conta de todos os aparelhos.",
  },
  {
    n: "06",
    quando: "responsabilidade da empresa",
    titulo: "Se vazou dado pessoal, a LGPD tem prazo",
    texto:
      "A empresa avalia se precisa avisar o governo e as pessoas atingidas. O prazo é curto e conta de quando ela soube.",
  },
];
