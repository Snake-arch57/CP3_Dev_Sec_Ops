import type { DictionaryTable } from "../dictionary";

export const investigation: DictionaryTable = {
  benchTitle: { pt: "Dicas sobre este e-mail", en: "Hints about this email" },

  runToolPrompt: {
    pt: "Toque para ver esta dica.",
    en: "Tap to see this hint.",
  },
  runButton: { pt: "Ver dica", en: "See hint" },

  domainLabel: { pt: "Endereço do site", en: "Site address" },
  yes: { pt: "Sim", en: "Yes" },
  no: { pt: "Não", en: "No" },

  aiUnavailable: {
    pt: "IA Corporativa não conseguiu analisar este email.",
    en: "Corporate AI could not analyze this email.",
  },
  phishingProbabilityLabel: { pt: "Chance de ser golpe", en: "Chance it is a scam" },
  aiDisclaimer: {
    pt: "Lembre-se: a IA Corporativa é uma ferramenta de apoio e pode errar, especialmente em golpes mais sofisticados.",
    en: "Remember: Corporate AI is a support tool and can be wrong, especially with more sophisticated scams.",
  },

  noAttachments: { pt: "Este email não possui anexos.", en: "This email has no attachments." },
  fileNameLabel: { pt: "Nome do arquivo", en: "File name" },
  declaredExtensionLabel: { pt: "O nome do arquivo diz", en: "The file name says" },
  actualTypeLabel: { pt: "O arquivo é na verdade", en: "The file actually is" },
  sizeLabel: { pt: "Tamanho", en: "Size" },
  hasMacroLabel: { pt: "Tem programa embutido", en: "Has a program inside" },

  noHttpsLink: {
    pt: "Nenhum link com cadeado para conferir.",
    en: "No link with a padlock to check.",
  },
  companyLabel: { pt: "Empresa", en: "Company" },
  issuerLabel: { pt: "Emitido por", en: "Issued by" },
  validityLabel: { pt: "Validade", en: "Validity" },
  certificateValidLabel: { pt: "Cadeado válido", en: "Padlock valid" },
  certValidYes: { pt: "sim", en: "yes" },
  certValidNo: { pt: "não", en: "no" },

  senderDomainLabel: { pt: "Endereço de quem mandou", en: "Address of who sent it" },
  noReputationData: {
    pt: "Não há mais nada registrado sobre este endereço.",
    en: "Nothing else is on record about this address.",
  },

  originServerLabel: { pt: "Computador que enviou", en: "Computer that sent it" },
  originIpLabel: { pt: "Número da conexão", en: "Connection number" },
  routeLabel: { pt: "Rota", en: "Route" },

  noRecordFound: {
    pt: "Nada encontrado sobre quem mandou.",
    en: "Nothing found about who sent it.",
  },
  internalStatusLabel: { pt: "O que a empresa sabe", en: "What the company knows" },
  observationsLabel: { pt: "Observações", en: "Notes" },
  statusTrustedVendor: { pt: "Fornecedor confiável", en: "Trusted vendor" },
  statusNeverUsed: { pt: "Nunca escreveu antes", en: "Never wrote before" },
  statusRecentDomain: { pt: "Endereço criado há poucos dias", en: "Address created days ago" },
  statusPreviouslyReported: { pt: "Email já denunciado", en: "Email previously reported" },

  noLinks: { pt: "Este email não contém links.", en: "This email contains no links." },
  linkPointsTo: { pt: '"{{text}}" aponta para', en: '"{{text}}" points to' },

  noQrCode: { pt: "Este email não contém QR Code.", en: "This email contains no QR code." },
  qrDestinationLabel: { pt: "Destino real do QR Code", en: "QR code's real destination" },

  noAttachmentToTest: {
    pt: "Nenhum anexo para testar em sandbox.",
    en: "No attachment to test in sandbox.",
  },
  runningInSandbox: {
    pt: "Executando {{fileName}} em ambiente isolado...",
    en: "Running {{fileName}} in an isolated environment...",
  },
  outcomeNoActivity: {
    pt: "Nenhuma atividade suspeita detectada.",
    en: "No suspicious activity detected.",
  },
  outcomeRansomware: {
    pt: "Tentativa de criptografar arquivos detectada.",
    en: "Attempt to encrypt files detected.",
  },
  outcomeSuspiciousConnection: {
    pt: "Conexão de rede suspeita detectada.",
    en: "Suspicious network connection detected.",
  },
  outcomeMalwareDownload: {
    pt: "Tenta baixar mais vírus para o computador.",
    en: "Tries to download more viruses onto the computer.",
  },
  outcomeRegistryChange: {
    pt: "Alteração suspeita no registro do sistema.",
    en: "Suspicious change to the system registry.",
  },
  outcomeProcessCreation: {
    pt: "Criação de processos não solicitados.",
    en: "Creation of unrequested processes.",
  },

  displayNameLabel: { pt: "Nome exibido", en: "Display name" },
  fullAddressLabel: { pt: "Endereço completo", en: "Full address" },

  noOutOfBandCheck: {
    pt: "Nenhum contato conhecido para confirmar por outro canal.",
    en: "No known contact to confirm through another channel.",
  },
  outOfBandDialing: {
    pt: "Ligando para o contato já confirmado anteriormente...",
    en: "Calling the previously confirmed contact...",
  },
  outOfBandChannelLabel: { pt: "Canal usado", en: "Channel used" },
  outOfBandOutcomeLabel: { pt: "Resultado", en: "Result" },
  outOfBandOutcomeConfirmedLegitimate: {
    pt: "O contato confirmou: o envio é legítimo.",
    en: "The contact confirmed: the message is legitimate.",
  },
  outOfBandOutcomeConfirmedFraud: {
    pt: "O contato confirmou: eles NÃO enviaram isso. É fraude.",
    en: "The contact confirmed: they did NOT send this. It's fraud.",
  },
  outOfBandOutcomeUnreachable: {
    pt: "Não foi possível confirmar por esse canal a tempo.",
    en: "Could not confirm through this channel in time.",
  },
};
