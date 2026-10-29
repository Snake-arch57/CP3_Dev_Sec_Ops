"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { usePhase } from "@/lib/hooks/usePhase";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PlayingScreen } from "@/components/game/PlayingScreen";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { checkpointTrack, setActiveTrack, trackForDay } from "@/lib/lofi-music";

export default function PlayDayPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const { day, state, dispatch, notFound } = usePhase(dayId, locale);
  const { data: profile } = usePlayerProfile();

  useEffect(() => {
    if (state?.status === "phase_summary" || state?.status === "phase_complete") {
      router.replace(`/play/${dayId}/results`);
    }
  }, [state?.status, dayId, router]);

  // Cada fase toca sua própria faixa "tensa"; ao sair, volta pro clima calmo do
  // checkpoint. Só surte efeito se o jogador já tiver ligado o rádio (autoplay
  // de áudio exige gesto do usuário).
  useEffect(() => {
    setActiveTrack(trackForDay(dayId));
    return () => setActiveTrack(checkpointTrack());
  }, [dayId]);

  if (notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg text-center">
        <p className="text-text-muted">{t("phasesGame.phaseNotAvailable")}</p>
        <Button asChild variant="outline">
          <Link href="/phases">
            <ArrowLeft className="h-4 w-4" /> {t("phasesGame.backToPhases")}
          </Link>
        </Button>
      </div>
    );
  }

  if (!day || !state || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-2 bg-bg text-text-muted">
        <ShieldCheck className="h-5 w-5 animate-pulse text-primary" />
        {t("phasesGame.loadingPhase")}
      </div>
    );
  }

  if (state.status === "intro") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t("phasesGame.dayNumber", { number: day.dayNumber })}
            </span>
            <h1 className="font-stencil text-xl font-semibold uppercase tracking-wide">{day.title}</h1>
            <p className="text-sm text-text-muted">{day.description}</p>
            <p className="text-xs text-text-muted">
              {t("phasesGame.emailsAndMinutes", {
                count: day.emailIds.length,
              })}
            </p>
            <Button size="lg" className="mt-2 w-full" onClick={() => dispatch({ type: "START" })}>
              {t("phasesGame.startShift")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.status === "playing") {
    return (
      <PlayingScreen state={state} dispatch={dispatch} />
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg text-text-muted">
      {t("phasesGame.finalizingPhase")}
    </div>
  );
}
