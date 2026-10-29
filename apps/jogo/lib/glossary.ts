import type { Locale } from "./i18n/locale";

/**
 * Manual do jogo: as palavras que aparecem nas fases, em português comum.
 *
 * Regra de escrita: o título é o nome em linguagem de gente, não a sigla. Quem
 * está jogando precisa reconhecer o golpe, não decorar o nome técnico dele —
 * por isso saíram SPF/DKIM/DMARC, "sandbox" e "BEC", que não ajudam ninguém a
 * decidir se clica ou não.
 *
 * O `id` alimenta o ícone em `components/ui/glossary-manual.tsx` (que tem
 * fallback, então remover um verbete não quebra a tela).
 */
export interface GlossaryTerm {
  id: string;
  term: Record<Locale, string>;
  definition: Record<Locale, string>;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "phishing",
    term: { pt: "Golpe por mensagem falsa", en: "Fake message scam" },
    definition: {
      pt: "Mensagem que finge ser de uma empresa ou de alguém conhecido, para pegar sua senha, um código ou dinheiro.",
      en: "A message pretending to be from a company or someone you know, to get your password, a code or money.",
    },
  },
  {
    id: "engenharia_social",
    term: { pt: "Manipulação", en: "Manipulation" },
    definition: {
      pt: "Usar pressa, medo ou autoridade para você agir sem pensar. É o que faz um golpe simples funcionar.",
      en: "Using hurry, fear or authority to make you act without thinking. It is what makes a simple scam work.",
    },
  },
  {
    id: "malware",
    term: { pt: "Vírus", en: "Virus" },
    definition: {
      pt: "Programa feito para estragar o computador, roubar dados ou espiar o que você digita.",
      en: "A program made to damage your computer, steal data or spy on what you type.",
    },
  },
  {
    id: "ransomware",
    term: { pt: "Sequestro de arquivos", en: "File hostage scam" },
    definition: {
      pt: "Programa que tranca todos os arquivos e cobra dinheiro para devolver. Numa empresa, passa de um computador para os outros.",
      en: "A program that locks every file and demands money to release them. In a company, it spreads from one computer to the rest.",
    },
  },
  {
    id: "qr_falso",
    term: { pt: "QR Code falso", en: "Fake QR code" },
    definition: {
      pt: "Quadradinho que leva a um site falso ou a um pagamento para a conta do golpista. Você só descobre depois de apontar a câmera.",
      en: "A code that leads to a fake site or sends a payment to the scammer. You only find out after pointing your camera at it.",
    },
  },
  {
    id: "senha_fraca",
    term: { pt: "Senha fraca", en: "Weak password" },
    definition: {
      pt: "Senha curta, óbvia ou repetida em vários sites. Se vazar de um lugar, abre todos os outros.",
      en: "A short, obvious password, or one reused across sites. If it leaks in one place, it opens all the others.",
    },
  },
  {
    id: "mfa",
    term: { pt: "Verificação em duas etapas", en: "Two-step verification" },
    definition: {
      pt: "Além da senha, o serviço pede mais uma prova de que é você. Ninguém de verdade pede para você desligar isso.",
      en: "Besides the password, the service asks for one more proof it is you. Nobody legitimate asks you to turn this off.",
    },
  },
  {
    id: "usb_infectado",
    term: { pt: "Pendrive achado", en: "A USB stick someone found" },
    definition: {
      pt: "Pendrive deixado de propósito para alguém achar e espetar no computador. Ao espetar, instala o vírus sozinho.",
      en: "A USB stick left on purpose for someone to find and plug in. Plugging it in installs the virus by itself.",
    },
  },
  {
    id: "whatsapp_falso",
    term: { pt: "WhatsApp falso", en: "Fake WhatsApp contact" },
    definition: {
      pt: "Número novo com a foto de alguém que você conhece, dizendo que trocou de aparelho e precisa de dinheiro.",
      en: "A new number with the photo of someone you know, saying they changed phones and need money.",
    },
  },
  {
    id: "microsoft_falso",
    term: { pt: "Suporte técnico falso", en: "Fake tech support" },
    definition: {
      pt: "Alguém se passa pelo suporte de um programa famoso e diz que sua conta tem problema, para você clicar e entregar a senha.",
      en: "Someone poses as support for a well-known program and says your account has a problem, so you click and hand over your password.",
    },
  },
  {
    id: "fornecedor_comprometido",
    term: { pt: "Fornecedor invadido", en: "Hacked supplier" },
    definition: {
      pt: "O e-mail vem mesmo do fornecedor de verdade, mas quem está escrevendo é o golpista, que entrou na conta dele.",
      en: "The email really does come from the real supplier, but the person writing is the scammer, who got into their account.",
    },
  },
  {
    id: "pix_falso",
    term: { pt: "PIX falso", en: "Fake payment request" },
    definition: {
      pt: "Pedido urgente de pagamento em nome de um chefe ou fornecedor. Antes de confirmar, leia o nome do dono da conta.",
      en: "An urgent payment request in the name of a boss or supplier. Before confirming, read the account holder's name.",
    },
  },
  {
    id: "boleto_adulterado",
    term: { pt: "Boleto trocado", en: "Swapped invoice slip" },
    definition: {
      pt: "Boleto de verdade com os dados de pagamento trocados. O dinheiro vai para a conta do golpista.",
      en: "A real invoice slip with the payment details swapped. The money goes to the scammer's account.",
    },
  },
  {
    id: "deepfake",
    term: { pt: "Voz e rosto clonados", en: "Cloned voice and face" },
    definition: {
      pt: "Áudio ou vídeo falso feito por computador para imitar uma pessoa de verdade. Poucos segundos de voz já bastam.",
      en: "Fake audio or video made by computer to imitate a real person. A few seconds of voice is enough.",
    },
  },
  {
    id: "anexo_perigoso",
    term: { pt: "Anexo perigoso", en: "Dangerous attachment" },
    definition: {
      pt: "Arquivo que esconde um programa. O nome engana: \"documento.pdf.exe\" termina em .exe, então é programa, não documento.",
      en: "A file hiding a program. The name fools you: \"document.pdf.exe\" ends in .exe, so it is a program, not a document.",
    },
  },
  {
    id: "certificado_digital",
    term: { pt: "O cadeado do site", en: "The padlock on a site" },
    definition: {
      pt: "Mostra que a conversa com o site vai embaralhada. Não quer dizer que o site é honesto: quase todo site de golpe tem cadeado.",
      en: "It shows the conversation with the site is scrambled. It does not mean the site is honest: almost every scam site has one.",
    },
  },
  {
    id: "dominio_falso",
    term: { pt: "Endereço parecido", en: "Lookalike address" },
    definition: {
      pt: "Endereço de site quase igual ao verdadeiro, com uma letra trocada ou uma palavra a mais. De relance, parece o oficial.",
      en: "A web address almost identical to the real one, with a swapped letter or an extra word. At a glance, it looks official.",
    },
  },
];
