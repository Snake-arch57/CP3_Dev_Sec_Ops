"use client";

import Link from "next/link";
import { Search, Brain, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function MinigamesPage() {
  const { t } = useLocale();

  const MINIGAMES = [
    {
      href: "/minigames/caca-phishing",
      title: t("minigames.cacaPhishingTitle"),
      description: t("minigames.cacaPhishingDescription"),
      icon: Search,
      meta: t("minigames.cacaPhishingMeta"),
    },
    {
      href: "/minigames/quiz",
      title: t("minigames.quizTitle"),
      description: t("minigames.quizDescription"),
      icon: Brain,
      meta: t("minigames.quizMeta"),
    },
  ];

  return (
    <div>
      <PageHeader title={t("minigames.listTitle")} description={t("minigames.listDescription")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {MINIGAMES.map((game) => (
          <Card key={game.href}>
            <CardContent className="flex flex-col gap-3 py-5">
              <game.icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{game.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{game.description}</p>
              </div>
              <p className="text-xs text-text-muted">{game.meta}</p>
              <Button asChild className="mt-2">
                <Link href={game.href}>
                  <PlayCircle className="h-4 w-4" /> {t("minigames.play")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
