/**
 * Conteúdo da seção sobre inteligência artificial.
 *
 * Duas regras específicas desta seção, além das do resto do site:
 *
 * 1. **Nenhum número.** Circulam muitas estatísticas sobre golpes com IA e
 *    quase nenhuma resiste à conferência — são estimativas de fornecedor de
 *    segurança vendendo produto. Como a regra do projeto é número só com
 *    fonte primária, aqui não entra número nenhum, e a página diz isso.
 *
 * 2. **Nada de alarme.** O objetivo é o leitor sair sabendo o que mudou e o
 *    que continua funcionando, não com medo de usar a ferramenta. IA também
 *    está do lado da defesa (filtro de spam, antifraude de banco), e a página
 *    reconhece isso.
 */

export type ItemTriagem = {
  id: string;
  texto: string;
  /** Verdadeiro quando é seguro colar num chatbot público. */
  seguro: boolean;
  motivo: string;
};

/** Itens do exercício "isso pode ir para uma IA pública?". */
export const TRIAGEM: ItemTriagem[] = [
  {
    id: "email-trabalho",
    texto: "Melhorar um e-mail que você mesmo escreveu, sem dados de ninguém",
    seguro: true,
    motivo: "O texto é seu e não expõe ninguém.",
  },
  {
    id: "planilha-clientes",
    texto: "Uma planilha de clientes com nome, CPF e telefone, para “organizar”",
    seguro: false,
    motivo:
      "São dados de outras pessoas, sem autorização delas. Pela LGPD, quem colou responde, e a empresa também. Troque os dados por “cliente A”, “cliente B”.",
  },
  {
    id: "resumo-materia",
    texto: "Pedir explicação de um assunto que você está estudando",
    seguro: true,
    motivo: "Não tem dado pessoal. Só confira a resposta: a IA pode inventar.",
  },
  {
    id: "exame",
    texto: "Foto do exame médico de um parente, para entender o resultado",
    seguro: false,
    motivo:
      "Dado de saúde tem proteção especial na lei, e nem é seu. Pergunte ao médico.",
  },
  {
    id: "senha",
    texto: "Sua senha ou um código de confirmação, para “ver se é forte”",
    seguro: false,
    motivo:
      "Nunca. Ela fica guardada lá e pode ser lida por pessoas. Para testar, use o Teste de senha deste site.",
  },
];

export type Mudanca = {
  titulo: string;
  oQueEra: string;
  oQueMudou: string;
  oQueFazer: string;
};

/** O que a IA efetivamente mudou na mecânica dos golpes. */
export const MUDANCAS: Mudanca[] = [
  {
    titulo: "Português errado não é mais pista",
    oQueEra: "A dica era desconfiar de erro de português.",
    oQueMudou: "Hoje qualquer um cria um texto perfeito em segundos.",
    oQueFazer:
      "Olhe o que a mensagem pede: dinheiro, código, pressa. E confira o endereço do site.",
  },
  {
    titulo: "Voz e rosto podem ser imitados",
    oQueEra: "Ouvir a voz ou ver o rosto da pessoa era prova.",
    oQueMudou:
      "Poucos segundos de áudio bastam para imitar uma voz. Videochamada falsa já enganou empresas, mas ainda é rara.",
    oQueFazer:
      "Pediram dinheiro por ligação ou vídeo? Desligue e ligue você mesmo para o número que já tinha salvo.",
  },
  {
    titulo: "O golpe parece feito para você",
    oQueEra: "A mesma mensagem ia para todo mundo.",
    oQueMudou:
      "Agora ela pode citar sua empresa, sua cidade e o que você postou.",
    oQueFazer:
      "Não importa o quanto ela sabe de você. Importa o que ela pede.",
  },
];

export type Defesa = {
  titulo: string;
  texto: string;
};

/**
 * As defesas que continuam funcionando — todas escolhidas por um critério:
 * não dependem de você conseguir detectar a falsificação. Contra imitação
 * boa, tentar "perceber" é a estratégia que falha.
 */
export const DEFESAS: Defesa[] = [
  {
    titulo: "Combine uma palavra-código com a família",
    texto:
      "Se alguém pedir dinheiro com pressa, peça que diga a palavra. Quem não souber não é quem diz ser.",
  },
  {
    titulo: "Volte pelo caminho que você já conhece",
    texto:
      "Ligue para o número salvo na agenda. Abra você mesmo o app do banco ou digite o endereço do site.",
  },
  {
    titulo: "Leia o nome de quem vai receber o PIX",
    texto:
      "Nenhum áudio muda o nome na tela de confirmação. Se não for quem pediu, não pague.",
  },
  {
    titulo: "Verificação em duas etapas",
    texto:
      "É um código a mais, além da senha, que aparece no seu celular. Voz imitada não cria esse código. Nunca passe o código para ninguém.",
  },
];
