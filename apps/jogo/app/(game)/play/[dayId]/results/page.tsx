"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Coins, Star, Trophy } from "lucide-react";
import { usePhase } from "@/lib/hooks/usePhase";
import { useSavePhaseResult } from "@/lib/hooks/usePlayerProfile";
import { getEmailsForDay } from "@repo/shared/content";
import { useGameSessionStore } from "@/lib/stores/gameSessionStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function PhaseResultsPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const { day, state } = usePhase(dayId, locale);
  const reset = useGameSessionStore((s) => s.reset);
  const savePhaseResult = useSavePhaseResult();
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (state?.status !== "phase_summary" || hasSavedRef.current) return;
    hasSavedRef.current = true;

    const dayEmails = getEmailsForDay(dayId, locale);
    const conceptCorrectCounts: Record<string, number> = {};
    state.results.forEach((result, i) => {
      if (!result.correct) return;
      const email = dayEmails[i];
      email?.tags.forEach((tag) => {
        conceptCorrectCounts[tag] = (conceptCorrectCounts[tag] ?? 0) + 1;
      });
    });

    savePhaseResult.mutate({
      dayId,
      correctCount: state.totals.correctCount,
      wrongCount: state.totals.wrongCount,
      totalScore: state.totals.totalScore,
      xpEarned: state.totals.xpEarned,
      moneyEarned: state.totals.moneyEarned,
      timeUsedSeconds: Math.round(state.totals.timeUsedSeconds),
      bestCombo: state.totals.bestCombo,
      conceptCorrectCounts,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.status]);

  if (!day || (state?.status !== "phase_summary" && state?.status !== "phase_complete")) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-text-muted">
        {t("phasesGame.noResultsAvailable")}
      </div>
    );
  }

  const totals = state.totals;
  const results = state.status === "phase_summary" ? state.results : [];
  const emails = getEmailsForDay(dayId, locale);

  function handleExit(path: string) {
    reset();
    router.push(path);
  }

  return (
    <div className="min-h-dvh bg-bg px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="font-stencil text-2xl font-semibold uppercase tracking-wide">
            {t("phasesGame.endOfShiftTitle", { title: day.title })}
          </h1>
          <p className="mt-1 text-text-muted">{t("phasesGame.reviewPerformance")}</p>
        </div>

        {/*
          Eram quatro indicadores: acertos, erros, melhor combo e tempo usado.
          Combo saiu com a mecânica. Tempo saiu porque, sem cronômetro, exibi-lo
          só convida a comparar quem foi mais rápido — a pressão que acabou de
          ser removida. O tempo continua sendo medido e gravado; só não é placar.
        */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-1 py-4">
              <CheckCircle2 className="h-6 w-6 text-success" />
              <span className="font-pixel text-lg">{totals.correctCount}</span>
              <span className="text-xs text-text-muted">{t("phasesGame.correctLabel")}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-1 py-4">
              <XCircle className="h-6 w-6 text-danger" />
              <span className="font-pixel text-lg">{totals.wrongCount}</span>
              <span className="text-xs text-text-muted">{t("phasesGame.wrongLabel")}</span>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardContent className="flex flex-col items-center gap-3 py-5">
            <div className="flex items-center justify-around w-full">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-pixel text-xs">
                  +{savePhaseResult.data?.xpAwarded ?? totals.xpEarned} XP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-warning" />
                <span className="font-pixel text-xs">
                  +{savePhaseResult.data?.moneyAwarded ?? totals.moneyEarned} {t("phasesGame.coinsLabel")}
                </span>
              </div>
              <div className="text-sm text-text-muted">
                {t("phasesGame.scoreLabel")} <span className="font-pixel text-xs">{totals.totalScore}</span>
              </div>
            </div>
            {savePhaseResult.data?.alreadyCompleted && (
              <p className="text-center text-xs text-text-muted">{t("phasesGame.practiceModeNotice")}</p>
            )}
          </CardContent>
        </Card>

        {savePhaseResult.data && savePhaseResult.data.newlyUnlocked.length > 0 && (
          <Card className="mt-4 border-warning/40">
            <CardContent className="py-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-warning">
                <Trophy className="h-5 w-5" /> {t("phasesGame.newAchievements")}
              </h3>
              <ul className="flex flex-col gap-2">
                {savePhaseResult.data.newlyUnlocked.map((achievement) => (
                  <li key={achievement.id} className="text-sm">
                    <span className="font-medium text-text">{achievement.title}</span>
                    <span className="text-text-muted"> — {achievement.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <Card className="mt-4">
            <CardContent className="py-5">
              <h3 className="mb-3 font-semibold">{t("phasesGame.detailedReview")}</h3>
              <ul className="flex flex-col gap-3">
                {results.map((result, i) => {
                  const email = emails[i];
                  return (
                    <li key={email?.id ?? i} className="border-b border-border pb-3 last:border-0">
                      <div className="mb-1 flex items-center gap-2">
                        {result.correct ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-danger" />
                        )}
                        <span className="flex-1 truncate text-sm font-medium">
                          {email?.subject ?? t("phasesGame.emailFallback", { number: i + 1 })}
                        </span>
                        <Badge variant={result.correct ? "success" : "danger"}>
                          {result.correct ? t("phasesGame.correctBadge") : t("phasesGame.incorrectBadge")}
                        </Badge>
                        <span className="shrink-0 text-sm text-text-muted">{result.finalScore} pts</span>
                      </div>
                      {email && (
                        <p className="text-sm text-text-muted">
                          {result.correct ? email.explanation.short : email.explanation.detailed}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => handleExit("/phases")}>
            {t("phasesGame.backToPhases")}
          </Button>
          <Button className="flex-1" onClick={() => handleExit(`/play/${dayId}`)}>
            {t("phasesGame.playAgain")}
          </Button>
        </div>
      </div>
    </div>
  );
}
