"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import type { PlayingState, PhaseAction } from "@repo/shared/engine";
import type { PlayerAction } from "@repo/shared/schemas";
import { GameHud } from "@/components/hud/GameHud";
import { EmailViewer } from "@/components/email/EmailViewer";
import { EmailActionBar } from "@/components/email/EmailActionBar";
import { InvestigationBench } from "@/components/investigation-bench/InvestigationBench";
import { DecisionStamp } from "@/components/game/DecisionStamp";
import { Button } from "@/components/ui/Button";
import { useGameTimer } from "@/lib/hooks/useGameTimer";
import { useInvestigation } from "@/lib/hooks/useInvestigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const STAMP_DELAY_MS = 650;

/**
 * Tela da partida.
 *
 * Saíram os eventos aleatórios (pop-up do chefe, enxurrada de e-mails e a
 * tela tremendo de "lag"). Eles existiam para roubar tempo de um cronômetro que
 * não existe mais — e, sem ele, sobrava só a interrupção.
 *
 * O `useGameTimer` continua ligado: ele não mostra nada nem encerra a fase, só
 * mede quanto a pessoa levou, que é gravado no resultado.
 */
export function PlayingScreen({
  state,
  dispatch,
}: {
  state: PlayingState;
  dispatch: (action: PhaseAction) => void;
}) {
  const { t } = useLocale();
  const [benchOpen, setBenchOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PlayerAction | null>(null);
  useGameTimer(true, dispatch);

  const currentEmail = state.emails[state.currentEmailIndex]!;
  const { decide, toolsUsed } = useInvestigation(currentEmail);
  const senderAddressRevealed = toolsUsed.includes("sender_address");

  function handleDecide(action: PlayerAction) {
    if (pendingAction) return;
    setPendingAction(action);
    window.setTimeout(() => {
      decide(action);
      setPendingAction(null);
    }, STAMP_DELAY_MS);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg pt-14">
      <GameHud
        dayNumber={state.day.dayNumber}
        xp={state.xp}
        emailAtual={state.currentEmailIndex + 1}
        totalEmails={state.emails.length}
        sairPara="/phases"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6">
        <div className="relative">
          <EmailViewer
            key={currentEmail.id}
            email={currentEmail}
            revealedSenderAddress={senderAddressRevealed ? currentEmail.sender.emailAddressRaw : undefined}
          />
          <DecisionStamp action={pendingAction} />
        </div>

        <Button variant="outline" size="lg" onClick={() => setBenchOpen(true)} disabled={!!pendingAction}>
          <Lightbulb className="h-5 w-5" /> {t("phasesGame.investigateButton")}
        </Button>

        <EmailActionBar onDecide={handleDecide} disabled={!!pendingAction} />
      </div>

      <InvestigationBench email={currentEmail} open={benchOpen} onOpenChange={setBenchOpen} />
    </div>
  );
}
