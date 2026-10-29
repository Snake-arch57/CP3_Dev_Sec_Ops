"use client";

import * as Icons from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAchievements } from "@repo/shared/content";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function toPascalCase(kebab: string) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export default function AchievementsPage() {
  const { locale, t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const achievements = getAchievements(locale);

  return (
    <div>
      <PageHeader
        title={t("mainPages.achievementsTitle")}
        description={t("mainPages.achievementsDescription")}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon =
            (Icons as unknown as Record<string, Icons.LucideIcon>)[toPascalCase(achievement.icon)] ??
            Icons.Award;
          const unlocked = profile?.unlockedAchievementIds.includes(achievement.id);
          return (
            <Card key={achievement.id} className={cn(!unlocked && "opacity-60")}>
              <CardContent className="flex flex-col gap-3 py-5">
                <div className="flex items-center justify-between">
                  <Icon className={cn("h-8 w-8", unlocked ? "text-warning" : "text-text-muted")} />
                  <Badge variant={unlocked ? "success" : "neutral"}>
                    {unlocked ? t("mainPages.achievementUnlocked") : t("mainPages.achievementLocked")}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{achievement.description}</p>
                </div>
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  {t("mainPages.reward")}
                  <span className="font-pixel text-[10px]">{achievement.xpReward} XP</span>·
                  <span className="font-pixel text-[10px]">
                    {achievement.moneyReward} {t("mainPages.coins")}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
