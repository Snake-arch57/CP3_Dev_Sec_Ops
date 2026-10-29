"use client";

import { Paperclip, QrCode as QrCodeIcon } from "lucide-react";
import type { Email } from "@repo/shared/schemas";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EmailViewer({ email, revealedSenderAddress }: { email: Email; revealedSenderAddress?: string }) {
  const { t } = useLocale();
  return (
    <Card className="flex-1 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-5 py-2 text-xs text-text-muted">
        <span className="h-2 w-2 rounded-full bg-danger/70" />
        <span className="h-2 w-2 rounded-full bg-warning/70" />
        <span className="h-2 w-2 rounded-full bg-success/70" />
        <span className="ml-2 font-stencil uppercase tracking-wide">{t("phasesGame.inboxHeader")}</span>
      </div>

      <div className="border-b border-border p-5">
        <h2 className="text-lg font-bold text-text">{email.subject}</h2>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-sm font-bold text-primary">
            {initials(email.sender.displayName)}
          </div>
          <div className="flex-1 space-y-1 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <span className="w-12 shrink-0 text-text-muted">{t("phasesGame.fromLabel")}</span>
              <span className="font-semibold text-text">{email.sender.displayName}</span>
              <span className="text-text-muted">
                {revealedSenderAddress ? `<${revealedSenderAddress}>` : t("phasesGame.hiddenAddress")}
              </span>
            </div>
            <div className="flex gap-x-2">
              <span className="w-12 shrink-0 text-text-muted">{t("phasesGame.toLabel")}</span>
              <span className="text-text">voce@leroymerlin.com.br</span>
            </div>
            <div className="flex gap-x-2">
              <span className="w-12 shrink-0 text-text-muted">{t("phasesGame.dateLabel")}</span>
              <span className="text-text">{formatDate(email.headers.sentAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="prose-sm max-w-none bg-surface p-5 text-sm leading-relaxed text-text [&_p]:mb-3"
        dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
      />

      {email.links.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {email.links.map((link) => (
            <span
              key={link.id}
              className="cursor-default rounded-sm bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary underline decoration-dotted"
            >
              {link.displayText}
            </span>
          ))}
        </div>
      )}

      {email.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          {email.attachments.map((att) => (
            <Badge key={att.id} variant="neutral" className="gap-1.5 rounded-sm py-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              {att.fileName} · {att.sizeKB}KB
            </Badge>
          ))}
        </div>
      )}

      {email.qrCode && (
        <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-sm text-text-muted">
          <QrCodeIcon className="h-8 w-8 text-text" />
          {t("phasesGame.qrAttached")}
        </div>
      )}
    </Card>
  );
}
