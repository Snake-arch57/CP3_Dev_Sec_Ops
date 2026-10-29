import type { DictionaryTable } from "../dictionary";

export const adminPages: DictionaryTable = {
  pageTitle: { pt: "Painel Admin", en: "Admin Panel" },
  pageDescription: { pt: "Cadastre funcionários com acesso ao jogo.", en: "Register employees with access to the game." },
  provisionalPasswordFor: { pt: "Senha provisória para", en: "Temporary password for" },
  provisionalPasswordNote: {
    pt: "Passe essa senha para o funcionário. Ele será obrigado a trocá-la no primeiro acesso.",
    en: "Give this password to the employee. They must change it on first login.",
  },
  registerEmployee: { pt: "Cadastrar funcionário", en: "Register employee" },
  usernamePlaceholder: { pt: "Nome de usuário", en: "Username" },
  fullNamePlaceholder: { pt: "Nome completo", en: "Full name" },
  departmentPlaceholder: { pt: "Setor (ex: Caixa, Estoque, TI)", en: "Department (e.g. Checkout, Stock, IT)" },
  passwordPlaceholder: { pt: "Senha inicial", en: "Initial password" },
  passwordHint: {
    pt: "Mínimo 8 caracteres. O funcionário troca essa senha no primeiro acesso.",
    en: "At least 8 characters. The employee changes this password on first login.",
  },
  createFallbackError: { pt: "Não foi possível cadastrar.", en: "Could not register the employee." },
  registering: { pt: "Cadastrando...", en: "Registering..." },
  register: { pt: "Cadastrar", en: "Register" },
  provisionalPasswordBadge: { pt: "Senha provisória", en: "Temporary password" },
  levelAbbrev: { pt: "Nv {{level}}", en: "Lvl {{level}}" },
  resetPassword: { pt: "Resetar senha", en: "Reset password" },
  removeConfirm: { pt: "Remover e apagar progresso?", en: "Remove and erase progress?" },
};
