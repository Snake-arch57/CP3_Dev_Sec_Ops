import { EmailSchema, type Email } from "../../schemas/email.schema";
import { DaySchema, type Day } from "../../schemas/phase.schema";

export function makeEmail(overrides: Partial<Email> = {}): Email {
  return EmailSchema.parse({
    id: "test-email-1",
    dayId: "test-day",
    order: 1,
    subject: "Assunto de teste",
    bodyHtml: "<p>Corpo de teste</p>",
    sender: {
      displayName: "Remetente Teste",
      emailAddressRaw: "teste@exemplo.com",
      domain: "exemplo.com",
      isSpoofed: false,
      spoofType: "none",
    },
    links: [],
    attachments: [],
    headers: {
      fromServer: "mail.exemplo.com",
      sourceIp: "1.2.3.4",
      spf: "pass",
      dkim: "pass",
      dmarc: "pass",
      sentAt: "2026-01-01T00:00:00Z",
      routeHops: ["1.2.3.4"],
    },
    riskLevel: "safe",
    correctAction: "accept",
    primaryConcept: "phishing",
    tags: ["phishing"],
    difficulty: 1,
    investigationHints: [
      { toolId: "sender_address", revealsField: "sender.domain", summaryText: "dominio ok" },
    ],
    explanation: { short: "ok", detailed: "detalhes" },
    idealInvestigationSeconds: 3,
    ...overrides,
  });
}

export function makeDay(overrides: Partial<Day> = {}, emailIds: string[] = ["test-email-1"]): Day {
  return DaySchema.parse({
    id: "test-day",
    dayNumber: 1,
    title: "Dia de teste",
    description: "Descrição de teste",
    difficultyRange: [1, 1],
    timeLimitSeconds: 120,
    emailIds,
    events: [],
    isBossDay: false,
    ...overrides,
  });
}
