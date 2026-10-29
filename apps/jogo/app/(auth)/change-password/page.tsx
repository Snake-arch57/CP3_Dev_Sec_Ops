"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { useChangePassword } from "@/lib/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ChangePasswordPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: profile, isLoading } = usePlayerProfile();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isLoading && profile === null) router.replace("/login");
  }, [isLoading, profile, router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) return;
    changePassword.mutate(
      { currentPassword, newPassword },
      { onSuccess: () => router.push("/") },
    );
  }

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="" width={56} height={56} />
            <KeyRound className="h-6 w-6 text-primary" />
            <h1 className="font-stencil text-lg font-semibold uppercase tracking-wide">
              {profile?.mustChangePassword ? t("auth.forcedChangeTitle") : t("auth.changePasswordTitle")}
            </h1>
            <p className="text-center text-sm text-text-muted">
              {profile?.mustChangePassword
                ? t("auth.forcedChangeDescription")
                : t("auth.changePasswordDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="currentPassword" className="text-sm font-medium text-text-muted">
                {profile?.mustChangePassword ? t("auth.temporaryPassword") : t("auth.currentPassword")}
              </label>
              <input
                id="currentPassword"
                type="password"
                autoFocus
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-sm font-medium text-text-muted">
                {t("auth.newPassword")}
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-text-muted">
                {t("auth.confirmNewPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            {passwordsMismatch && <p className="text-sm text-danger">{t("auth.passwordsMismatch")}</p>}
            {changePassword.error && (
              <p className="text-sm text-danger">
                {changePassword.error instanceof ApiError
                  ? changePassword.error.message
                  : t("auth.genericChangePasswordError")}
              </p>
            )}

            <Button
              type="submit"
              disabled={
                changePassword.isPending ||
                !currentPassword ||
                !newPassword ||
                newPassword.length < 8 ||
                passwordsMismatch
              }
            >
              {changePassword.isPending ? t("common.saving") : t("auth.setNewPassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
