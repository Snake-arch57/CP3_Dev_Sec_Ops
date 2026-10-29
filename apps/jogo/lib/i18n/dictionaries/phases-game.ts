import type { DictionaryTable } from "../dictionary";

export const phasesGame: DictionaryTable = {
  /*
   * A decisão tem duas respostas e uma saída honesta.
   *
   * Antes era "Aceitar", "Excluir" e "Reportar ao TI" — três verbos que pediam
   * do jogador uma escolha de procedimento, quando a pergunta que o treinamento
   * quer treinar é uma só: isto é golpe ou não é? Excluir ainda era pior que
   * inútil: apagar um golpe em silêncio é justamente o que impede o time de
   * segurança de avisar quem mais recebeu.
   *
   * "Não sei" ficou no lugar dele porque é a resposta verdadeira na maior parte
   * das vezes, e a que se quer premiar na vida real — quem não sabe, pergunta.
   * Não vale ponto e também não tira: nenhum e-mail tem "não sei" como resposta
   * certa (ver o comentário em EmailActionBar sobre os dois que precisaram
   * mudar).
   */
  accept: { pt: "Não é golpe", en: "Not a scam" },
  report: { pt: "É golpe", en: "It's a scam" },
  unsure: { pt: "Não sei", en: "Not sure" },

  inboxHeader: { pt: "Caixa de Entrada — Correspondência", en: "Inbox — Correspondence" },
  fromLabel: { pt: "De:", en: "From:" },
  hiddenAddress: { pt: "<endereço escondido — veja as dicas>", en: "<hidden address — see the hints>" },
  toLabel: { pt: "Para:", en: "To:" },
  dateLabel: { pt: "Data:", en: "Date:" },
  qrAttached: { pt: "QR Code anexado à mensagem", en: "QR code attached to message" },

  investigateButton: { pt: "Ver dicas", en: "See hints" },

  stampAccept: { pt: "NÃO É GOLPE", en: "NOT A SCAM" },
  stampDelete: { pt: "NÃO SEI", en: "NOT SURE" },
  stampReport: { pt: "É GOLPE", en: "IT'S A SCAM" },

  interruptionLabel: { pt: "Interrupção", en: "Interruption" },

  phaseNotAvailable: { pt: "Esta fase ainda não está disponível.", en: "This phase is not available yet." },
  backToPhases: { pt: "Voltar às fases", en: "Back to phases" },
  loadingPhase: { pt: "Carregando fase...", en: "Loading phase..." },
  dayNumber: { pt: "Dia {{number}}", en: "Day {{number}}" },
  emailsAndMinutes: {
    pt: "{{count}} e-mails · sem tempo limite",
    en: "{{count}} emails · no time limit",
  },
  startShift: { pt: "Começar o expediente", en: "Start the shift" },
  finalizingPhase: { pt: "Finalizando fase...", en: "Finalizing phase..." },

  noResultsAvailable: { pt: "Nenhum resultado disponível.", en: "No results available." },
  endOfShiftTitle: { pt: "Fim do expediente — {{title}}", en: "End of shift — {{title}}" },
  reviewPerformance: { pt: "Confira como você se saiu.", en: "Check out how you did." },
  correctLabel: { pt: "Acertos", en: "Correct" },
  wrongLabel: { pt: "Erros", en: "Wrong" },
  coinsLabel: { pt: "moedas", en: "coins" },
  scoreLabel: { pt: "Pontuação:", en: "Score:" },
  practiceModeNotice: {
    pt: 'Modo prática: você já concluiu esta fase antes, então repeti-la não rende XP nem moedas extras — isso evita "farmar" pontos para o ranking.',
    en: 'Practice mode: you\'ve already completed this phase before, so replaying it doesn\'t earn extra XP or coins — this prevents "farming" points for the ranking.',
  },
  newAchievements: { pt: "Novas conquistas", en: "New achievements" },
  detailedReview: { pt: "Revisão detalhada", en: "Detailed review" },
  emailFallback: { pt: "Email {{number}}", en: "Email {{number}}" },
  correctBadge: { pt: "Correto", en: "Correct" },
  incorrectBadge: { pt: "Incorreto", en: "Incorrect" },
  playAgain: { pt: "Jogar novamente", en: "Play again" },
};
