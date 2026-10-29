/**
 * Estimativa de resistência de senha — 100% local, sem rede e sem storage.
 *
 * Honestidade do cálculo, que é o ponto desta seção:
 *
 * A conta de força bruta pura só vale para uma senha que ninguém consegue
 * adivinhar de forma mais esperta. Um estimador que só multiplica alfabeto
 * por comprimento diz que "P@ssw0rd1" é forte — e isso é uma mentira
 * perigosa, porque essa senha cai numa lista de ataque nos primeiros
 * segundos. Por isso os padrões são checados ANTES da matemática, e quando
 * um deles bate, o veredito passa a ser o padrão, não a conta.
 */

/** Palpites por segundo assumidos no cenário principal, exibido na tela. */
export const PALPITES_POR_SEGUNDO = 1e11;

/** Cenário de contraste: tentativa contra o site, com bloqueio e limite. */
export const PALPITES_ONLINE = 10;

export type Motivo =
  | "lista"
  | "palavra-sufixo"
  | "sequencia"
  | "repeticao"
  | "data"
  | "curta"
  | "forca-bruta";

export type Analise = {
  comprimento: number;
  /** Tamanho do alfabeto deduzido dos caracteres usados. */
  alfabeto: number;
  /** Bits de entropia, já rebaixados quando um padrão foi detectado. */
  bits: number;
  segundos: number;
  segundosOnline: number;
  motivo: Motivo;
  /** Frase curta explicando o veredito, em linguagem de gente. */
  veredito: string;
  /** Verdadeiro quando a senha caiu num padrão conhecido. */
  fraca: boolean;
  /** Sinaliza texto com espaços, para explicar a ressalva de frase-senha. */
  pareceFrase: boolean;
};

/**
 * Amostra pequena e proposital de senhas campeãs de vazamento, incluindo as
 * tipicamente brasileiras. A lista real usada num ataque tem centenas de
 * milhões de linhas — a interface diz isso ao usuário, para não passar a
 * impressão de que "não achei aqui" significa "está segura".
 */
const LISTA_COMUM = new Set([
  "123456", "1234567", "12345678", "123456789", "1234567890", "12345",
  "1234", "111111", "000000", "654321", "102030", "123123", "112233",
  "password", "senha", "senha123", "123mudar", "mudar123", "trocar123",
  "qwerty", "qwertyui", "asdfgh", "zxcvbn", "1q2w3e4r", "abc123", "abcd1234",
  "admin", "administrador", "master", "root", "teste", "user", "usuario",
  "brasil", "brasil123", "saopaulo", "riodejaneiro", "corinthians",
  "flamengo", "palmeiras", "gremio", "vasco", "cruzeiro", "santos",
  "internacional", "atletico", "botafogo", "fluminense", "bahia",
  "amor", "amoreterno", "teamo", "euteamo", "familia", "felicidade",
  "deusefiel", "deusnocomando", "jesuscristo", "jesus", "principe",
  "iloveyou", "sunshine", "princess", "welcome", "monkey", "dragon",
  "football", "letmein", "shadow", "michael", "jordan", "batman",
  "gabriel", "rafael", "juliana", "mariana", "fernanda", "patricia",
  "carlos", "eduardo", "leonardo", "matheus", "guilherme", "beatriz",
]);

const SEQUENCIAS = [
  "abcdefghijklmnopqrstuvwxyz",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "0123456789",
];

/** Desfaz as trocas "espertas" que todo mundo faz e todo atacante prevê. */
function desleetar(s: string) {
  return s
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3€]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/0/g, "o")
    .replace(/[5$]/g, "s")
    .replace(/7/g, "t")
    .replace(/9/g, "g");
}

function tamanhoAlfabeto(s: string) {
  let n = 0;
  if (/[a-z]/.test(s)) n += 26;
  if (/[A-Z]/.test(s)) n += 26;
  if (/[0-9]/.test(s)) n += 10;
  if (/[^a-zA-Z0-9]/.test(s)) n += 33;
  // Acentos e caracteres fora do teclado básico ampliam bastante o espaço.
  if (/[^\x00-\x7F]/.test(s)) n += 100;
  return Math.max(n, 1);
}

function temSequencia(s: string) {
  const baixo = s.toLowerCase();
  for (const seq of SEQUENCIAS) {
    for (let i = 0; i + 4 <= seq.length; i++) {
      const trecho = seq.slice(i, i + 4);
      const invertido = trecho.split("").reverse().join("");
      if (baixo.includes(trecho) || baixo.includes(invertido)) return true;
    }
  }
  return false;
}

function ehRepeticao(s: string) {
  if (s.length < 4) return false;
  // "abcabcabc" ou "aaaaaa": a senha inteira é uma peça curta repetida.
  for (let peca = 1; peca <= Math.floor(s.length / 2); peca++) {
    if (s.length % peca !== 0) continue;
    const unidade = s.slice(0, peca);
    if (unidade.repeat(s.length / peca) === s) return true;
  }
  return false;
}

function temData(s: string) {
  return /(19|20)\d{2}/.test(s) || /\b\d{2}[\/.-]\d{2}[\/.-]\d{2,4}\b/.test(s);
}

/** Tira sufixos e prefixos previsíveis para achar a palavra-base. */
function nucleo(s: string) {
  return desleetar(s)
    .replace(/[^a-z]+$/g, "")
    .replace(/^[^a-z]+/g, "");
}

const MINUTO = 60;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;
const ANO = 365.25 * DIA;
const SECULO = 100 * ANO;

/** Idade do universo em segundos, o teto útil da escala. */
const IDADE_DO_UNIVERSO = 13.8e9 * ANO;

export function formatarDuracao(segundos: number): string {
  if (!isFinite(segundos) || segundos >= IDADE_DO_UNIVERSO) {
    return "mais que a idade do universo";
  }
  if (segundos < 1) return "instantâneo";

  const escalas: [limite: number, divisor: number, sing: string, plu: string][] =
    [
      [MINUTO, 1, "segundo", "segundos"],
      [HORA, MINUTO, "minuto", "minutos"],
      [DIA, HORA, "hora", "horas"],
      [ANO, DIA, "dia", "dias"],
      [SECULO, ANO, "ano", "anos"],
      [Infinity, SECULO, "século", "séculos"],
    ];

  for (const [limite, divisor, sing, plu] of escalas) {
    if (segundos >= limite) continue;

    const valor = segundos / divisor;
    const arredondado =
      valor >= 100 ? Math.round(valor) : Math.round(valor * 10) / 10;

    return `${arredondado.toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} ${arredondado === 1 ? sing : plu}`;
  }

  return "mais que a idade do universo";
}

export function analisar(senha: string): Analise {
  const comprimento = senha.length;
  const alfabeto = tamanhoAlfabeto(senha);
  const pareceFrase = /\s/.test(senha.trim()) && comprimento >= 12;

  const vazio: Analise = {
    comprimento: 0,
    alfabeto: 0,
    bits: 0,
    segundos: 0,
    segundosOnline: 0,
    motivo: "curta",
    veredito: "Digite algo para ver a estimativa.",
    fraca: false,
    pareceFrase: false,
  };
  if (comprimento === 0) return vazio;

  const bitsBrutos = comprimento * Math.log2(alfabeto);
  const montar = (
    bits: number,
    motivo: Motivo,
    veredito: string,
    fraca: boolean,
  ): Analise => {
    // Metade do espaço, porque em média o palpite certo vem no meio da busca.
    const palpites = Math.pow(2, bits) / 2;
    return {
      comprimento,
      alfabeto,
      bits,
      segundos: palpites / PALPITES_POR_SEGUNDO,
      segundosOnline: palpites / PALPITES_ONLINE,
      motivo,
      veredito,
      fraca,
      pareceFrase,
    };
  };

  const baixa = senha.toLowerCase();
  const semLeet = desleetar(senha);
  const base = nucleo(senha);

  if (LISTA_COMUM.has(baixa) || LISTA_COMUM.has(semLeet)) {
    return montar(
      0,
      "lista",
      "Essa senha está em listas de senhas vazadas. Cai na hora.",
      true,
    );
  }

  if (base.length >= 4 && LISTA_COMUM.has(base)) {
    return montar(
      Math.min(bitsBrutos, 14),
      "palavra-sufixo",
      `É “${base}” com enfeite. Trocar a por @ ou pôr número no fim não engana.`,
      true,
    );
  }

  if (ehRepeticao(senha)) {
    return montar(
      Math.min(bitsBrutos, 12),
      "repeticao",
      "É um pedaço curto repetido. Vale só o tamanho do pedaço.",
      true,
    );
  }

  if (temSequencia(senha)) {
    return montar(
      Math.min(bitsBrutos, 20),
      "sequencia",
      "Tem uma sequência do teclado ou do alfabeto. Os golpistas testam isso logo.",
      true,
    );
  }

  if (temData(senha) && comprimento < 14) {
    return montar(
      Math.min(bitsBrutos, 24),
      "data",
      "Tem uma data dentro. Datas são poucas, e aniversário é fácil de descobrir.",
      true,
    );
  }

  if (comprimento < 8) {
    return montar(
      bitsBrutos,
      "curta",
      "Curta demais. Com menos de 8 caracteres, nem símbolos salvam.",
      true,
    );
  }

  const analise = montar(
    bitsBrutos,
    "forca-bruta",
    "",
    false,
  );

  if (analise.segundos < 60 * 60 * 24) {
    analise.veredito =
      "Dá para testar todas as combinações em menos de um dia. Aumente o tamanho.";
    analise.fraca = true;
  } else if (analise.segundos < 60 * 60 * 24 * 365 * 100) {
    analise.veredito =
      "Boa, se usada em um lugar só. Repetida, fica tão fraca quanto o pior site onde está.";
  } else {
    analise.veredito =
      "Ninguém descobre essa testando combinações. O risco é repetir a senha ou cair num golpe e entregá-la.";
  }

  return analise;
}

/** Exemplos do comparativo "comprimento vence complexidade decorada". */
export const COMPARATIVO = [
  { rotulo: "Curta e cheia de símbolos", senha: "Xk9#mQ2!" },
  { rotulo: "A mesma, com mais duas letras", senha: "Xk9#mQ2!vB" },
  { rotulo: "Quatro palavras simples", senha: "girafa porta melancia trilho" },
];
