import type { DictionaryTable } from "../dictionary";

export const mainPages: DictionaryTable = {
  // /phases
  phasesTitle: { pt: "Fases", en: "Phases" },
  phasesDescription: {
    pt: "Cada dia de trabalho traz novos e-mails para conferir.",
    en: "Each work day brings new emails to check.",
  },
  dayTitle: { pt: "Dia {{number}} — {{title}}", en: "Day {{number}} — {{title}}" },
  difficultyTag: { pt: "Dificuldade {{min}}-{{max}}", en: "Difficulty {{min}}-{{max}}" },
  dayNumber: { pt: "Dia {{number}}", en: "Day {{number}}" },
  completed: { pt: "Concluído", en: "Completed" },
  emailsAndMinutes: { pt: "{{count}} e-mails", en: "{{count}} emails" },
  completePreviousDay: { pt: "Complete o dia anterior", en: "Complete the previous day" },
  playAgain: { pt: "Jogar novamente", en: "Play again" },
  start: { pt: "Iniciar", en: "Start" },

  // /shop
  shopTitle: { pt: "Loja", en: "Shop" },
  shopDescription: {
    pt: "Os upgrades dão mais dicas, mas nunca resolvem um e-mail por você.",
    en: "Upgrades give you more hints, but they never solve an email for you.",
  },
  owned: { pt: "Adquirido", en: "Owned" },
  buyFor: { pt: "Comprar por", en: "Buy for" },

  // /achievements
  achievementsTitle: { pt: "Conquistas", en: "Achievements" },
  achievementsDescription: {
    pt: "Marcos que provam sua evolução em segurança da informação.",
    en: "Milestones that prove your growth in information security.",
  },
  achievementUnlocked: { pt: "Desbloqueada", en: "Unlocked" },
  achievementLocked: { pt: "Bloqueada", en: "Locked" },
  reward: { pt: "Recompensa:", en: "Reward:" },
  coins: { pt: "moedas", en: "coins" },

  // /ranking — por setor, nunca por pessoa (LGPD)
  you: { pt: "Você", en: "You" },
  rankingClassDescription: {
    pt: "A pontuação é somada por setor. Toque em Alunos para ver a turma.",
    en: "Scores are summed by sector. Tap Students to see the class.",
  },
  rankingTitle: { pt: "Ranking por setor", en: "Ranking by department" },
  rankingDescription: {
    pt: "A pontuação é somada por setor. Nomes de pessoas não aparecem.",
    en: "Points are added up by department. No individual names are shown.",
  },
  noOnePlayedYet: { pt: "Nenhum setor pontuou ainda.", en: "No department has scored yet." },
  yourDepartment: { pt: "Seu setor", en: "Your department" },

  // circular-carousel.tsx
  carouselAriaLabel: { pt: "Seleção de fase", en: "Phase selection" },
  carouselPrevious: { pt: "Fase anterior", en: "Previous phase" },
  carouselNext: { pt: "Próxima fase", en: "Next phase" },
  carouselGoTo: { pt: "Ir para fase {{number}}", en: "Go to phase {{number}}" },
  carouselOf: { pt: "de {{total}}", en: "of {{total}}" },
};
