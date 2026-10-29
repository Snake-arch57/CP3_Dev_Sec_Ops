/**
 * Glossário: as palavras que a pessoa encontra por aí, explicadas em português
 * comum.
 *
 * Regras de escrita:
 *  - o título do verbete é a palavra em português; o termo técnico, quando
 *    existe, vai no campo `tambem` — ninguém precisa decorar "phishing" para
 *    se proteger de uma mensagem falsa;
 *  - definição curta, no máximo duas frases;
 *  - toda entrada responde "por que isso importa pra mim", senão é enciclopédia;
 *  - onde existe um mito comum, o mito é desmontado (ver `https`, que é a maior
 *    fonte de falsa sensação de segurança).
 *
 * O `id` vira âncora (`/glossario#https`) e é o alvo do componente `<Termo>`.
 * Ao remover um verbete, confira quem aponta para ele: `<Termo id="...">` e
 * `<TermosRelacionados ids={[...]}>` quebram em silêncio.
 */

export type Grupo = "sites" | "senhas" | "golpes" | "brasil";

export type Verbete = {
  id: string;
  termo: string;
  /** O nome técnico, quando a pessoa puder encontrar por aí. */
  tambem?: string;
  /** O que é, sem jargão. */
  definicao: string;
  /** Por que alguém deveria se importar. */
  importa: string;
  grupo: Grupo;
};

export const GRUPOS: { id: Grupo; titulo: string; descricao: string }[] = [
  {
    id: "sites",
    titulo: "Antes de entrar num site",
    descricao: "O que olhar antes de digitar qualquer coisa.",
  },
  {
    id: "senhas",
    titulo: "Senhas",
    descricao: "As palavras que aparecem nas configurações de segurança.",
  },
  {
    id: "golpes",
    titulo: "Os golpes",
    descricao: "Os nomes que você vê no noticiário, em português comum.",
  },
  {
    id: "brasil",
    titulo: "PIX, seus dados e seus direitos",
    descricao: "O que usar para resolver um problema aqui no Brasil.",
  },
];

export const VERBETES: Verbete[] = [
  // ─── Antes de entrar num site ───────────────────────────────────────────
  {
    id: "dominio",
    termo: "Endereço do site",
    tambem: "domínio",
    grupo: "sites",
    definicao:
      "O nome que vem antes da primeira barra. Em `banco.com.br/entrar`, o endereço é `banco.com.br`.",
    importa:
      "É ele que diz de quem é o site. O golpista põe o nome da loja no começo: `loja.com.premios.net` é do `premios.net`.",
  },
  {
    id: "https",
    termo: "O cadeado do navegador",
    grupo: "sites",
    definicao:
      "O cadeadinho ao lado do endereço mostra que a conversa com o site vai embaralhada no caminho.",
    importa:
      "**Cadeado não quer dizer site honesto.** Quase todo site de golpe tem um. Olhe o endereço, não o cadeado.",
  },
  {
    id: "rede-aberta",
    termo: "Wi-Fi público",
    grupo: "sites",
    definicao: "Wi-Fi sem senha, de shopping, aeroporto ou loja. Qualquer um entra.",
    importa:
      "O risco é a rede falsa com o nome copiado, que abre uma tela de login falsa. Desconfie de Wi-Fi que pede CPF.",
  },

  // ─── Senhas ─────────────────────────────────────────────────────────────
  {
    id: "2fa",
    termo: "Verificação em duas etapas",
    tambem: "2FA, confirmação em duas etapas",
    grupo: "senhas",
    definicao:
      "Além da senha, o serviço pede mais uma prova de que é você: um código, a digital ou o rosto.",
    importa:
      "Com ela, a senha roubada sozinha não abre sua conta. Comece pelo e-mail: é por ele que se trocam as outras senhas.",
  },
  {
    id: "gerenciador-de-senhas",
    termo: "Gerenciador de senhas",
    grupo: "senhas",
    definicao:
      "Um cofre que cria e guarda uma senha diferente para cada site. Você decora só a senha do cofre.",
    importa:
      "Ele só preenche no site certo. Se não preencher numa página que parece a de sempre, confira o endereço.",
  },
  {
    id: "frase-senha",
    termo: "Frase-senha",
    grupo: "senhas",
    definicao:
      "Senha feita de palavras sorteadas, tipo `girafa porta melancia trilho`. Longa e fácil de lembrar.",
    importa:
      "As palavras precisam ser sorteadas. Trecho de música ou ditado já está nas listas dos criminosos.",
  },

  // ─── Os golpes ──────────────────────────────────────────────────────────
  {
    id: "phishing",
    termo: "Golpe por mensagem falsa",
    tambem: "phishing",
    grupo: "golpes",
    definicao:
      "Mensagem que finge ser de uma empresa ou de alguém conhecido, para conseguir sua senha, um código ou dinheiro.",
    importa:
      "É assim que quase todo golpe começa. Chega por e-mail, SMS, WhatsApp ou ligação, quase sempre com pressa.",
  },
  {
    id: "engenharia-social",
    termo: "Manipulação",
    tambem: "engenharia social",
    grupo: "golpes",
    definicao:
      "Convencer alguém a fazer algo errado usando pressa, medo, autoridade ou carinho — “mãe, troquei de número”.",
    importa:
      "Está por trás de quase todo golpe. Cair não é burrice: é um golpe bem feito num dia ruim.",
  },
  {
    id: "vazamento",
    termo: "Vazamento de dados",
    grupo: "golpes",
    definicao:
      "Quando os dados guardados por uma empresa vão parar na mão de estranhos: nome, telefone, CPF, senhas.",
    importa:
      "É por isso que o golpista sabe seu nome e sua última compra. Isso faz a mensagem parecer verdadeira.",
  },
  {
    id: "malware",
    termo: "Vírus e programas espiões",
    tambem: "malware",
    grupo: "golpes",
    definicao:
      "Programa feito para estragar ou roubar. Pode gravar o que você digita ou se passar pelo aplicativo do banco.",
    importa:
      "No celular, instale só pela loja oficial. No computador, desconfie de anexo que pede para “habilitar conteúdo”.",
  },
  {
    id: "sim-swap",
    termo: "Troca de chip",
    grupo: "golpes",
    definicao:
      "Golpistas convencem a operadora a passar seu número para outro chip. Daí em diante, seus SMS chegam para eles.",
    importa:
      "Por isso o código por SMS é a proteção mais fraca. Se o sinal sumir do nada, ligue para a operadora de outro telefone.",
  },
  {
    id: "deepfake",
    termo: "Voz e rosto clonados",
    tambem: "deepfake",
    grupo: "golpes",
    definicao:
      "Áudio ou vídeo falso feito por computador para imitar uma pessoa de verdade. Poucos segundos de voz já bastam.",
    importa:
      "Ouvir a voz não prova mais nada. Ligue para o número salvo, ou combine antes uma palavra que só a família sabe.",
  },

  // ─── PIX, seus dados e seus direitos ────────────────────────────────────
  {
    id: "chave-pix",
    termo: "Chave PIX",
    grupo: "brasil",
    definicao:
      "O apelido de uma conta: CPF, telefone, e-mail ou uma sequência de letras. Antes de confirmar, o app mostra o nome do dono.",
    importa:
      "Leia esse nome sempre. Se não for de quem está pedindo, é golpe, por melhor que seja a desculpa.",
  },
  {
    id: "med",
    termo: "Pedido de devolução do PIX",
    tambem: "MED",
    grupo: "brasil",
    definicao:
      "Regra do Banco Central para pedir de volta um PIX feito em golpe. O pedido é feito no seu próprio banco.",
    importa: "O prazo é de até 80 dias, mas peça no mesmo dia: o dinheiro some rápido.",
  },
  {
    id: "lgpd",
    termo: "LGPD",
    tambem: "Lei Geral de Proteção de Dados",
    grupo: "brasil",
    definicao:
      "Lei que diz o que as empresas podem fazer com seus dados. Você pode saber o que guardam e pedir para apagar.",
    importa: "No trabalho, dado de cliente não pode circular por WhatsApp nem por e-mail pessoal.",
  },
  {
    id: "conta-gov-br",
    termo: "Conta gov.br",
    grupo: "brasil",
    definicao:
      "O login único do governo. Serve para carteira de motorista digital, carteira de trabalho e vacinas.",
    importa:
      "É por ela que você faz boletim de ocorrência online. Ligue a verificação em duas etapas nessa conta.",
  },
  {
    id: "registrato",
    termo: "Registrato",
    grupo: "brasil",
    definicao:
      "Relatório grátis do Banco Central com as contas, os empréstimos e as chaves PIX no seu CPF.",
    importa:
      "Mostra se alguém abriu conta ou pegou empréstimo no seu nome. Consulte depois de qualquer golpe com seus documentos.",
  },
];
