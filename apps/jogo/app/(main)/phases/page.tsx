"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, PlayCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CircularCarousel, type CarouselItem } from "@/components/ui/circular-carousel";
import { getAllDays } from "@repo/shared/content";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function PhasesPage() {
  const { locale, t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const days = getAllDays(locale);
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems: CarouselItem[] = [
    ...days.map((day, i) => {
      const previousDay = days[i - 1];
      const locked = i > 0 && previousDay ? !profile?.completedDayIds.includes(previousDay.id) : false;
      return {
        id: day.id,
        title: t("mainPages.dayTitle", { number: day.dayNumber, title: day.title }),
        description: day.description,
        tag: t("mainPages.difficultyTag", { min: day.difficultyRange[0], max: day.difficultyRange[1] }),
        locked,
      };
    }),
  ];

  const selectedDay = activeIndex < days.length ? days[activeIndex] : undefined;
  const selectedItem = carouselItems[activeIndex];
  const completed = selectedDay ? (profile?.completedDayIds.includes(selectedDay.id) ?? false) : false;

  return (
    <div>
      <PageHeader title={t("mainPages.phasesTitle")} description={t("mainPages.phasesDescription")} />

      <Card className="overflow-visible">
        <CardContent className="py-10">
          <CircularCarousel items={carouselItems} activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
          {selectedDay && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {t("mainPages.dayNumber", { number: selectedDay.dayNumber })}
                </span>
                <Badge variant={completed ? "success" : "neutral"}>
                  {completed
                    ? t("mainPages.completed")
                    : t("mainPages.difficultyTag", {
                        min: selectedDay.difficultyRange[0],
                        max: selectedDay.difficultyRange[1],
                      })}
                </Badge>
              </div>
              <h2 className="font-stencil text-lg font-semibold uppercase tracking-wide">
                {selectedDay.title}
              </h2>
              <p className="max-w-md text-sm text-text-muted">{selectedDay.description}</p>
              <p className="text-xs text-text-muted">
                {t("mainPages.emailsAndMinutes", {
                  count: selectedDay.emailIds.length,
                })}
              </p>
              {selectedItem?.locked ? (
                <Button variant="outline" disabled className="mt-2 w-full max-w-xs">
                  <Lock className="h-4 w-4" /> {t("mainPages.completePreviousDay")}
                </Button>
              ) : (
                <Button asChild className="mt-2 w-full max-w-xs">
                  <Link href={`/play/${selectedDay.id}`}>
                    {completed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> {t("mainPages.playAgain")}
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" /> {t("mainPages.start")}
                      </>
                    )}
                  </Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
