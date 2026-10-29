import type { DictionaryTable } from "../dictionary";

export const auth: DictionaryTable = {
  appName: { pt: "Hackudinhos", en: "Hackudinhos" },
  loginTagline: {
    pt: "Treinamento de segurança da informação · Leroy Merlin",
    en: "Information security training · Leroy Merlin",
  },
  bootstrapNotice: {
    pt: "Primeiro acesso: crie a conta de administrador.",
    en: "First access: create the administrator account.",
  },
  yourName: { pt: "Seu nome", en: "Your name" },
  yourNamePlaceholder: { pt: "Digite seu nome", en: "Enter your name" },
  username: { pt: "Usuário", en: "Username" },
  usernamePlaceholder: { pt: "seu.usuario", en: "your.username" },
  password: { pt: "Senha", en: "Password" },
  genericLoginError: { pt: "Não foi possível entrar.", en: "Couldn't log in." },
  signingIn: { pt: "Entrando...", en: "Signing in..." },
  createAdmin: { pt: "Criar administrador", en: "Create administrator" },
  signIn: { pt: "Entrar", en: "Sign in" },

  forcedChangeTitle: { pt: "Troca de senha obrigatória", en: "Password change required" },
  changePasswordTitle: { pt: "Trocar senha", en: "Change password" },
  forcedChangeDescription: {
    pt: "Este é seu primeiro acesso. Defina uma nova senha para continuar.",
    en: "This is your first access. Set a new password to continue.",
  },
  changePasswordDescription: {
    pt: "Digite sua senha atual e escolha uma nova.",
    en: "Enter your current password and choose a new one.",
  },
  temporaryPassword: { pt: "Senha provisória", en: "Temporary password" },
  currentPassword: { pt: "Senha atual", en: "Current password" },
  newPassword: { pt: "Nova senha", en: "New password" },
  confirmNewPassword: { pt: "Confirmar nova senha", en: "Confirm new password" },
  passwordsMismatch: { pt: "As senhas não coincidem.", en: "Passwords don't match." },
  genericChangePasswordError: {
    pt: "Não foi possível trocar a senha.",
    en: "Couldn't change the password.",
  },
  setNewPassword: { pt: "Definir nova senha", en: "Set new password" },
};
