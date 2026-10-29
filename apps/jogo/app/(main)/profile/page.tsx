"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { levelForXp, xpIntoCurrentLevel } from "@repo/shared/engine";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ProfilePage() {
  const { t } = useLocale();
  const { data: profile } = usePlayerProfile();
  if (!profile) return null;

  const level = levelForXp(profile.xp);
  const { current, required } = xpIntoCurrentLevel(profile.xp);
  const totalCorrect = profile.phaseHistory.reduce((sum, r) => sum + r.correctCount, 0);
  const totalWrong = profile.phaseHistory.reduce((sum, r) => sum + r.wrongCount, 0);
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  return (
    <div>
      <PageHeader title={t("profileSettings.profileTitle")} description={t("profileSettings.profileDescription")} />

      <Card>
        <CardContent className="flex flex-col gap-4 py-6">
          <div>
            <h2 className="text-lg font-semibold">{profile.playerName}</h2>
            <p className="text-sm text-text-muted">
              {t("common.level")} {level}
            </p>
          </div>
          <ProgressBar value={current} max={required} />
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-text-muted">{t("profileSettings.overallAccuracy")}</p>
            <p className="font-pixel text-xl">{accuracy}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-text-muted">{t("profileSettings.correctEmails")}</p>
            <p className="font-pixel text-xl">{totalCorrect}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-text-muted">{t("profileSettings.phasesCompleted")}</p>
            <p className="font-pixel text-xl">{profile.completedDayIds.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="py-5">
          <h3 className="mb-3 font-semibold">{t("profileSettings.phaseHistory")}</h3>
          {profile.phaseHistory.length === 0 ? (
            <p className="text-sm text-text-muted">{t("profileSettings.noPhasesYet")}</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {profile.phaseHistory.map((entry, i) => (
                <li key={i} className="flex justify-between border-b border-border py-2 last:border-0">
                  <span>{entry.dayId}</span>
                  <span className="text-text-muted">
                    {t("profileSettings.correctCount", { count: entry.correctCount })} ·{" "}
                    {t("profileSettings.wrongCount", { count: entry.wrongCount })} ·{" "}
                    {t("profileSettings.points", { count: entry.totalScore })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
