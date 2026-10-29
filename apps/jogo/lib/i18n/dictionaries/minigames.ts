import type { DictionaryTable } from "../dictionary";

/**
 * Textos dos minijogos.
 *
 * Reescritos junto com a retirada do cronômetro e do combo. A versão anterior
 * falava em "treinar seus reflexos", "antes do tempo acabar", "cada erro custa
 * pontos e quebra seu combo" e "respostas mais rápidas valem mais pontos" — e
 * soltava "MFA" numa descrição sem explicar.
 *
 * Duas regras para quem editar:
 *  1. Nada de pressa. Golpe funciona justamente quando a pessoa reage rápido
 *     demais; o jogo não pode pedir o mesmo reflexo que quer desfazer.
 *  2. Nada de sigla. Se a palavra precisa de explicação, troque pela explicação.
 */
export const minigames: DictionaryTable = {
  // /minigames (lista)
  listTitle: { pt: "Mini-jogos", en: "Minigames" },
  listDescription: {
    pt: "Jogos curtos para praticar o que você aprendeu.",
    en: "Short games to practice what you've learned.",
  },
  cacaPhishingTitle: { pt: "Caça-Golpe", en: "Scam Hunt" },
  cacaPhishingDescription: {
    pt: "Um e-mail por vez. Arraste para o lado: golpe ou de verdade.",
    en: "One email at a time. Swipe to one side: scam or real.",
  },
  cacaPhishingMeta: { pt: "Sem tempo · no seu ritmo", en: "No timer · at your own pace" },
  quizTitle: { pt: "Quiz de Segurança", en: "Security Quiz" },
  quizDescription: {
    pt: "Perguntas simples sobre como reconhecer um golpe: e-mail falso, PIX falso, boleto trocado e mais.",
    en: "Simple questions about spotting a scam: fake email, fake payment, swapped invoice, and more.",
  },
  quizMeta: { pt: "Sem tempo · no seu ritmo", en: "No timer · at your own pace" },
  play: { pt: "Jogar", en: "Play" },

  // caça-golpe: abertura
  cacaIntro: {
    pt: "Vão aparecer {{count}} e-mails, um de cada vez. Arraste para a esquerda se for golpe, para a direita se for de verdade. Não tem tempo: leia com calma.",
    en: "{{count}} emails will appear, one at a time. Swipe left if it's a scam, right if it's real. There's no timer: read calmly.",
  },
  start: { pt: "Começar", en: "Start" },
  check: { pt: "Conferir", en: "Check" },

  // caça-golpe: a partida, um cartão por vez
  cardCounter: { pt: "Cartão", en: "Card" },
  markScam: { pt: "É golpe", en: "It's a scam" },
  markReal: { pt: "É de verdade", en: "It's real" },
  swipeHint: {
    pt: "Arraste o cartão para o lado, use os botões ou as setas ← →",
    en: "Drag the card sideways, use the buttons, or the ← → arrow keys",
  },
  stampScam: { pt: "Golpe", en: "Scam" },
  stampReal: { pt: "De verdade", en: "Real" },
  feedbackCaughtScam: { pt: "Isso mesmo: era golpe.", en: "That's right: it was a scam." },
  feedbackCorrectReal: { pt: "Isso mesmo: esse era de verdade.", en: "That's right: that one was real." },
  feedbackMissedScam: { pt: "Esse era golpe.", en: "That one was a scam." },
  feedbackFalseAlarm: { pt: "Esse era de verdade.", en: "That one was real." },
  reviewTitle: { pt: "O que escapou", en: "What got past you" },
  reviewEmpty: {
    pt: "Você acertou todos. Não escapou nenhum.",
    en: "You got them all. Nothing got past you.",
  },

  // resultado (comum aos dois)
  gameOver: { pt: "Resultado", en: "Result" },
  correct: { pt: "Acertos", en: "Correct" },
  wrong: { pt: "Erros", en: "Wrong" },
  missed: { pt: "Golpes que passaram", en: "Scams you missed" },
  score: { pt: "Pontos:", en: "Points:" },
  playAgain: { pt: "Jogar de novo", en: "Play again" },

  // painel
  points: { pt: "Pontos", en: "Points" },
  question: { pt: "Pergunta", en: "Question" },
  next: { pt: "Próxima pergunta", en: "Next question" },
  seeResult: { pt: "Ver resultado", en: "See result" },

  // quiz: abertura
  quizIntroDescription: {
    pt: "São {{count}} perguntas. Não tem tempo: leia com calma. Depois de cada resposta, você vê a explicação.",
    en: "There are {{count}} questions. There's no timer: read calmly. After each answer, you'll see the explanation.",
  },
};
