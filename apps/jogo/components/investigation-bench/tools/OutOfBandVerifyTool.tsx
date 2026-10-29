"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, CheckCircle2, AlertTriangle } from "lucide-react";
import type { InvestigationToolProps } from "../types";
import { ToolField, InsightCallout } from "../shared/ToolResultPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const OUTCOME_LABEL_KEY: Record<string, string> = {
  confirmed_legitimate: "investigation.outOfBandOutcomeConfirmedLegitimate",
  confirmed_fraud: "investigation.outOfBandOutcomeConfirmedFraud",
  unreachable: "investigation.outOfBandOutcomeUnreachable",
};

export function OutOfBandVerifyTool({ email, revealed }: InvestigationToolProps) {
  const { t } = useLocale();
  const [phase, setPhase] = useState<"dialing" | "done">("dialing");

  useEffect(() => {
    setPhase("dialing");
    const timeout = setTimeout(() => setPhase("done"), 1300);
    return () => clearTimeout(timeout);
  }, [email.id]);

  if (!email.outOfBandCheck) {
    return <p className="text-sm text-text-muted">{t("investigation.noOutOfBandCheck")}</p>;
  }

  const check = email.outOfBandCheck;
  const isFraud = check.outcome === "confirmed_fraud";
  const isUnreachable = check.outcome === "unreachable";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <AnimatePresence mode="wait">
        {phase === "dialing" ? (
          <motion.div
            key="dialing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-text-muted"
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
            >
              <Phone className="h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-sm">{t("investigation.outOfBandDialing")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col items-center gap-3"
          >
            {isUnreachable ? (
              <PhoneOff className="h-10 w-10 text-warning" />
            ) : isFraud ? (
              <AlertTriangle className="h-10 w-10 text-danger" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-success" />
            )}
            <div className="w-full">
              <ToolField label={t("investigation.outOfBandChannelLabel")} value={check.channelDescription} />
              <ToolField
                label={t("investigation.outOfBandOutcomeLabel")}
                value={t(OUTCOME_LABEL_KEY[check.outcome] ?? OUTCOME_LABEL_KEY.unreachable!)}
              />
            </div>
            <InsightCallout revealed={revealed} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
