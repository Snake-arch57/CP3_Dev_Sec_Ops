"use client";

import Link from "next/link";
import { Coins, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { levelForXp, xpIntoCurrentLevel } from "@repo/shared/engine";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const STAT_CARDS = [
  { key: "money" as const, labelKey: "dashboard.money", icon: Coins, color: "text-warning" },
  { key: "reputation" as const, labelKey: "dashboard.reputation", icon: TrendingUp, color: "text-success" },
];

export default function HomePage() {
  const { t } = useLocale();
  const { data: profile } = usePlayerProfile();
  if (!profile) return null;

  const level = levelForXp(profile.xp);
  const { current, required } = xpIntoCurrentLevel(profile.xp);

  return (
    <div>
      <PageHeader
        title={t("dashboard.welcome", { name: profile.playerName })}
        description={t("dashboard.missionDescription")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <Star className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-text-muted">{t("common.level")}</p>
              <p className="font-pixel text-base">{level}</p>
            </div>
          </CardContent>
        </Card>
        {STAT_CARDS.map(({ key, labelKey, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-4 py-5">
              <Icon className={`h-8 w-8 ${color}`} />
              <div>
                <p className="text-xs text-text-muted">{t(labelKey)}</p>
                <p className="font-pixel text-base">{profile[key]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <ShieldCheck className="h-8 w-8 text-danger" />
            <div>
              <p className="text-xs text-text-muted">{t("dashboard.phasesCompleted")}</p>
              <p className="font-pixel text-base">{profile.completedDayIds.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="py-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">{t("dashboard.levelProgress", { level })}</span>
            <span className="font-pixel text-[10px] text-text-muted">
              {current} / {required} XP
            </span>
          </div>
          <ProgressBar value={current} max={required} />
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-border bg-gradient-to-br from-primary/15 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("dashboard.nextDayTitle")}</h2>
          <p className="text-sm text-text-muted">{t("dashboard.nextDayDescription")}</p>
        </div>
        <Button asChild size="lg">
          <Link href="/phases">{t("dashboard.goToPhases")}</Link>
        </Button>
      </div>
    </div>
  );
}
