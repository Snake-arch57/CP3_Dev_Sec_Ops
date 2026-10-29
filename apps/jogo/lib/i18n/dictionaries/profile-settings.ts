import type { DictionaryTable } from "../dictionary";

export const profileSettings: DictionaryTable = {
  // /settings
  settingsTitle: { pt: "Configurações", en: "Settings" },
  player: { pt: "Jogador", en: "Player" },
  username: { pt: "Usuário", en: "Username" },
  department: { pt: "Departamento", en: "Department" },
  changePassword: { pt: "Trocar senha", en: "Change password" },

  // /profile
  profileTitle: { pt: "Perfil", en: "Profile" },
  profileDescription: {
    pt: "Seu histórico como defensor da Leroy Merlin.",
    en: "Your history as a Leroy Merlin defender.",
  },
  overallAccuracy: { pt: "Precisão geral", en: "Overall accuracy" },
  correctEmails: { pt: "Emails corretos", en: "Correct emails" },
  phasesCompleted: { pt: "Fases concluídas", en: "Phases completed" },
  phaseHistory: { pt: "Histórico de fases", en: "Phase history" },
  noPhasesYet: { pt: "Nenhuma fase concluída ainda.", en: "No phases completed yet." },
  correctCount: { pt: "{{count}} acertos", en: "{{count}} correct" },
  wrongCount: { pt: "{{count}} erros", en: "{{count}} wrong" },
  points: { pt: "{{count}} pts", en: "{{count}} pts" },
};
