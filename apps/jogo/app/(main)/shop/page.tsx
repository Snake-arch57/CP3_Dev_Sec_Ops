"use client";

import * as Icons from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getUpgrades } from "@repo/shared/content";
import { usePlayerProfile, usePurchaseUpgrade } from "@/lib/hooks/usePlayerProfile";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function upgradeIcon(name: string) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[toPascalCase(name)];
  return Icon ?? Icons.Sparkles;
}

function toPascalCase(kebab: string) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export default function ShopPage() {
  const { locale, t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const purchase = usePurchaseUpgrade();
  const upgrades = getUpgrades(locale);

  return (
    <div>
      <PageHeader title={t("mainPages.shopTitle")} description={t("mainPages.shopDescription")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upgrades.map((upgrade) => {
          const Icon = upgradeIcon(upgrade.icon);
          const owned = profile?.ownedUpgradeIds.includes(upgrade.id);
          const canAfford = (profile?.money ?? 0) >= upgrade.priceMoney;
          return (
            <Card key={upgrade.id}>
              <CardContent className="flex flex-col gap-3 py-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {owned && <Badge variant="success">{t("mainPages.owned")}</Badge>}
                </div>
                <div>
                  <h3 className="font-semibold">{upgrade.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{upgrade.description}</p>
                </div>
                <Button
                  variant={owned ? "outline" : "primary"}
                  disabled={owned || !canAfford || purchase.isPending}
                  className="mt-2"
                  onClick={() => purchase.mutate(upgrade.id)}
                >
                  {owned ? (
                    t("mainPages.owned")
                  ) : (
                    <>
                      {t("mainPages.buyFor")} <span className="font-pixel text-[10px]">{upgrade.priceMoney}</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
