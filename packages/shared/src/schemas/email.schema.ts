import { z } from "zod";

export const PlayerActionSchema = z.enum(["accept", "delete", "report"]);
export type PlayerAction = z.infer<typeof PlayerActionSchema>;

export const RiskLevelSchema = z.enum(["safe", "suspicious", "malicious"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const SecurityConceptTagSchema = z.enum([
  "phishing",
  "engenharia_social",
  "malware",
  "ransomware",
  "qr_falso",
  "link_malicioso",
  "senha_fraca",
  "mfa",
  "usb_infectado",
  "whatsapp_falso",
  "sms_falso",
  "microsoft_falso",
  "fornecedor_comprometido",
  "bec",
  "pix_falso",
  "boleto_adulterado",
  "deepfake",
  "anexo_perigoso",
  // E-mail legítimo. Existe como tag própria porque o placar de domínio conta
  // as tags de cada acerto: enquanto os legítimos vinham marcados como
  // "phishing", aceitar corretamente um e-mail de verdade creditava domínio de
  // phishing a quem nunca reconheceu um golpe.
  "legitimo",
]);
export type SecurityConceptTag = z.infer<typeof SecurityConceptTagSchema>;

export const InvestigationToolIdSchema = z.enum([
  "sender_address",
  "link_hover",
  "domain_inspect",
  "attachment_analysis",
  "qr_preview",
  "header_inspect",
  "certificate_view",
  "internal_db_lookup",
  "sandbox_execution",
  "ai_assistant",
  "out_of_band_verify",
]);
export type InvestigationToolId = z.infer<typeof InvestigationToolIdSchema>;

export const SpoofTypeSchema = z.enum([
  "homograph",
  "lookalike_domain",
  "subdomain_trick",
  "display_name_spoof",
  "compromised_legit",
  "none",
]);

export const SenderInfoSchema = z.object({
  displayName: z.string(),
  emailAddressRaw: z.string(),
  domain: z.string(),
  isSpoofed: z.boolean(),
  spoofType: SpoofTypeSchema,
});
export type SenderInfo = z.infer<typeof SenderInfoSchema>;

export const LinkInfoSchema = z.object({
  id: z.string(),
  displayText: z.string(),
  actualUrl: z.string(),
  isMalicious: z.boolean(),
  redirectChain: z.array(z.string()).optional(),
});
export type LinkInfo = z.infer<typeof LinkInfoSchema>;

export const SandboxResultSchema = z.discriminatedUnion("outcome", [
  z.object({ outcome: z.literal("no_activity") }),
  z.object({ outcome: z.literal("ransomware_attempt"), details: z.string() }),
  z.object({ outcome: z.literal("suspicious_connection"), host: z.string() }),
  z.object({ outcome: z.literal("malware_download"), url: z.string() }),
  z.object({ outcome: z.literal("registry_change"), key: z.string() }),
  z.object({ outcome: z.literal("process_creation"), processName: z.string() }),
]);
export type SandboxResult = z.infer<typeof SandboxResultSchema>;

export const AttachmentInfoSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  declaredExtension: z.string(),
  actualType: z.string(),
  sizeKB: z.number().positive(),
  hasMacro: z.boolean().default(false),
  isMalicious: z.boolean(),
  sandboxResult: SandboxResultSchema.optional(),
});
export type AttachmentInfo = z.infer<typeof AttachmentInfoSchema>;

export const EmailHeadersSchema = z.object({
  fromServer: z.string(),
  sourceIp: z.string(),
  spf: z.enum(["pass", "fail", "neutral", "none"]),
  dkim: z.enum(["pass", "fail", "none"]),
  dmarc: z.enum(["pass", "fail", "none"]),
  sentAt: z.string(),
  routeHops: z.array(z.string()),
});
export type EmailHeaders = z.infer<typeof EmailHeadersSchema>;

export const CertificateInfoSchema = z.object({
  companyName: z.string(),
  issuer: z.string(),
  validFrom: z.string(),
  validTo: z.string(),
  domain: z.string(),
  isTechnicallyValid: z.boolean(),
  isTrustworthy: z.boolean(),
});
export type CertificateInfo = z.infer<typeof CertificateInfoSchema>;

export const QrCodeInfoSchema = z.object({
  imageAsset: z.string(),
  decodedUrl: z.string(),
  isMalicious: z.boolean(),
});
export type QrCodeInfo = z.infer<typeof QrCodeInfoSchema>;

export const InternalDbRecordSchema = z.object({
  senderStatus: z.enum([
    "trusted_vendor",
    "never_used",
    "recently_created_domain",
    "previously_reported",
  ]),
  notes: z.string().optional(),
});
export type InternalDbRecord = z.infer<typeof InternalDbRecordSchema>;

export const AiAssistantHintSchema = z.object({
  phishingProbability: z.number().min(0).max(100),
  isReliable: z.boolean(),
  reasoning: z.string(),
});
export type AiAssistantHint = z.infer<typeof AiAssistantHintSchema>;

export const OutOfBandCheckSchema = z.object({
  channelDescription: z.string(),
  outcome: z.enum(["confirmed_legitimate", "confirmed_fraud", "unreachable"]),
  details: z.string(),
});
export type OutOfBandCheck = z.infer<typeof OutOfBandCheckSchema>;

export const InvestigationHintSchema = z.object({
  toolId: InvestigationToolIdSchema,
  revealsField: z.string(),
  summaryText: z.string(),
});
export type InvestigationHint = z.infer<typeof InvestigationHintSchema>;

export const EmailSchema = z
  .object({
    id: z.string(),
    dayId: z.string(),
    order: z.number().int().nonnegative(),
    subject: z.string(),
    bodyHtml: z.string(),
    sender: SenderInfoSchema,
    links: z.array(LinkInfoSchema).default([]),
    attachments: z.array(AttachmentInfoSchema).default([]),
    qrCode: QrCodeInfoSchema.optional(),
    headers: EmailHeadersSchema,
    certificate: CertificateInfoSchema.optional(),
    internalDbRecord: InternalDbRecordSchema.optional(),
    aiAssistantHint: AiAssistantHintSchema.optional(),
    outOfBandCheck: OutOfBandCheckSchema.optional(),
    riskLevel: RiskLevelSchema,
    correctAction: PlayerActionSchema,
    primaryConcept: SecurityConceptTagSchema,
    tags: z.array(SecurityConceptTagSchema).min(1),
    difficulty: z.number().int().min(1).max(9),
    investigationHints: z.array(InvestigationHintSchema).min(1),
    explanation: z.object({
      short: z.string(),
      detailed: z.string(),
      conceptGlossaryId: z.string().optional(),
    }),
    idealInvestigationSeconds: z.number().int().positive(),
  })
  .superRefine((email, ctx) => {
    if (
      email.correctAction === "accept" &&
      email.riskLevel !== "safe" &&
      email.difficulty < 6
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Ação correta 'accept' com riskLevel != safe só é permitida em difficulty >= 6 (ex: fornecedor comprometido).",
        path: ["correctAction"],
      });
    }
    if (email.difficulty >= 3 && email.investigationHints.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Emails com difficulty >= 3 devem ter ao menos 2 investigationHints (pistas cruzadas).",
        path: ["investigationHints"],
      });
    }
  });
export type Email = z.infer<typeof EmailSchema>;
