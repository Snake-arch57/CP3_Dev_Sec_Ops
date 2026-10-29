import type { DictionaryTable } from "../dictionary";

export const common: DictionaryTable = {
  save: { pt: "Salvar", en: "Save" },
  saving: { pt: "Salvando...", en: "Saving..." },
  cancel: { pt: "Cancelar", en: "Cancel" },
  confirm: { pt: "Confirmar", en: "Confirm" },
  back: { pt: "Voltar", en: "Back" },
  loading: { pt: "Carregando...", en: "Loading..." },
  logout: { pt: "Sair", en: "Log out" },

  // Sair de uma partida em andamento. É diferente de `logout`, que encerra a
  // sessão: aqui a pessoa continua logada, só abandona a fase ou o mini-jogo.
  exitGame: { pt: "Sair", en: "Leave" },
  exitGameTitle: { pt: "Sair da partida?", en: "Leave this round?" },
  exitGameBody: {
    pt: "O que você respondeu até aqui não será salvo. O progresso só é gravado quando a partida termina.",
    en: "What you've answered so far won't be saved. Progress is only recorded when the round ends.",
  },
  exitGameConfirm: { pt: "Sair mesmo assim", en: "Leave anyway" },
  exitGameCancel: { pt: "Continuar jogando", en: "Keep playing" },
  level: { pt: "Nível", en: "Level" },
  edit: { pt: "Editar", en: "Edit" },
  delete: { pt: "Excluir", en: "Delete" },
  seconds: { pt: "s", en: "s" },
};
