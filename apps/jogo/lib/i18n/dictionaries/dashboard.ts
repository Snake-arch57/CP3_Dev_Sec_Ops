import type { DictionaryTable } from "../dictionary";

export const dashboard: DictionaryTable = {
  welcome: { pt: "Bem-vindo(a), {{name}}", en: "Welcome, {{name}}" },
  missionDescription: {
    pt: "Sua missão: proteger a Leroy Merlin contra ameaças digitais, um email de cada vez.",
    en: "Your mission: protect Leroy Merlin from digital threats, one email at a time.",
  },
  money: { pt: "Dinheiro", en: "Money" },
  reputation: { pt: "Reputação", en: "Reputation" },
  phasesCompleted: { pt: "Fases concluídas", en: "Phases completed" },
  levelProgress: { pt: "Progresso do nível {{level}}", en: "Level {{level}} progress" },
  nextDayTitle: { pt: "Pronto para o próximo dia de trabalho?", en: "Ready for the next work day?" },
  nextDayDescription: {
    pt: "Novos e-mails chegaram. Veja as dicas com calma antes de decidir.",
    en: "New emails have arrived. Take your time with the hints before deciding.",
  },
  goToPhases: { pt: "Ir para as fases", en: "Go to phases" },
};
