"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { useLogout } from "@/lib/hooks/useAuth";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function SettingsPage() {
  const { t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const logout = useLogout();
  const router = useRouter();

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => router.replace("/login") });
  }

  return (
    <div>
      <PageHeader title={t("profileSettings.settingsTitle")} />
      <Card>
        <CardContent className="flex flex-col gap-4 py-5">
          <div>
            <p className="text-sm text-text-muted">{t("profileSettings.player")}</p>
            <p className="font-medium">{profile?.playerName}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">{t("profileSettings.username")}</p>
            <p className="font-medium">@{profile?.username}</p>
          </div>
          {profile?.department && (
            <div>
              <p className="text-sm text-text-muted">{t("profileSettings.department")}</p>
              <p className="font-medium">{profile.department}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/change-password">
                <KeyRound className="h-4 w-4" /> {t("profileSettings.changePassword")}
              </Link>
            </Button>
            <Button variant="danger" onClick={handleLogout} disabled={logout.isPending}>
              <LogOut className="h-4 w-4" /> {t("common.logout")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
