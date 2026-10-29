"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuthStatus, useBootstrapAdmin, useLogin } from "@/lib/hooks/useAuth";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { ApiError } from "@/lib/api/client";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Roseta estilo "mancha de onça": anel irregular com um "vão" claro no meio.
// 3 variações de silhueta para não repetir a mesma mancha em todo canto.
const ROSETTE_PATHS = [
  {
    outer:
      "M46 6 C60 4 72 12 76 24 C90 26 96 40 90 52 C94 64 86 78 72 80 C66 92 50 96 38 88 C24 90 12 80 12 66 C2 60 0 46 8 36 C8 22 20 10 34 10 C38 8 42 6 46 6 Z",
    inner:
      "M44 32 C54 30 64 38 62 48 C70 52 68 64 58 66 C56 74 44 76 38 68 C28 68 24 56 32 50 C30 42 36 34 44 32 Z",
  },
  {
    outer:
      "M40 8 C56 2 74 10 78 26 C92 30 98 46 88 58 C92 72 78 86 62 84 C54 96 36 94 30 82 C16 82 8 68 14 54 C6 44 12 28 26 24 C28 14 34 10 40 8 Z",
    inner:
      "M42 30 C50 24 62 28 64 38 C74 40 76 52 66 58 C68 66 58 74 48 70 C40 76 30 70 32 60 C22 58 22 46 32 42 C32 34 36 30 42 30 Z",
  },
  {
    outer:
      "M50 4 C64 6 74 18 72 30 C88 34 92 50 82 60 C86 74 74 86 58 82 C50 94 32 92 28 78 C14 76 6 62 14 50 C10 36 22 22 36 22 C40 12 44 6 50 4 Z",
    inner:
      "M48 28 C58 26 66 34 62 44 C70 50 66 62 56 62 C52 70 40 68 40 58 C30 56 28 44 38 40 C38 32 42 28 48 28 Z",
  },
] as const;

function Rosette({
  variant,
  className,
  style,
}: {
  variant: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { outer, inner } = ROSETTE_PATHS[variant % ROSETTE_PATHS.length];
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none">
      <path d={outer} fill="var(--color-text)" />
      <path d={inner} fill="var(--color-bg)" />
    </svg>
  );
}

const ROSETTES = [
  { top: "10%", left: "14%", size: 264, rotate: -12, opacity: 0.4, flip: false, duration: 7, delay: 0, variant: 0 },
  { top: "18%", left: "80%", size: 192, rotate: 24, opacity: 0.32, flip: true, duration: 8.5, delay: 0.6, variant: 1 },
  { top: "46%", left: "6%", size: 168, rotate: 8, opacity: 0.3, flip: false, duration: 6.5, delay: 1.2, variant: 2 },
  { top: "62%", left: "88%", size: 234, rotate: -18, opacity: 0.36, flip: true, duration: 9, delay: 0.3, variant: 1 },
  { top: "82%", left: "22%", size: 186, rotate: 30, opacity: 0.3, flip: false, duration: 7.5, delay: 1.6, variant: 2 },
  { top: "88%", left: "62%", size: 150, rotate: -6, opacity: 0.28, flip: true, duration: 6, delay: 0.9, variant: 0 },
] as const;

function LoginBackgroundSpots() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {ROSETTES.map((spot, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: spot.top, left: spot.left }}
          animate={{
            y: [0, -14, 0],
            rotate: [spot.rotate - 7, spot.rotate + 7, spot.rotate - 7],
          }}
          transition={{
            duration: spot.duration,
            delay: spot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Rosette
            variant={spot.variant}
            style={
              {
                width: spot.size,
                height: spot.size,
                opacity: spot.opacity,
                transform: spot.flip ? "scaleX(-1)" : undefined,
              } as React.CSSProperties
            }
          />
        </motion.div>
      ))}
    </div>
  );
}

function FormField({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-muted">
        {label}
      </label>
      <input
        id={id}
        className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
        {...props}
      />
    </div>
  );
}

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: status, isLoading: statusLoading } = useAuthStatus();
  const { data: existingProfile } = usePlayerProfile();
  const login = useLogin();
  const bootstrapAdmin = useBootstrapAdmin();

  useEffect(() => {
    if (!existingProfile) return;
    router.replace(existingProfile.mustChangePassword ? "/change-password" : "/");
  }, [existingProfile, router]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const isBootstrap = status?.needsBootstrap === true;
  const pending = login.isPending || bootstrapAdmin.isPending;
  const error = login.error ?? bootstrapAdmin.error;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isBootstrap) {
      bootstrapAdmin.mutate(
        { username, password, displayName },
        { onSuccess: () => router.push("/") },
      );
    } else {
      login.mutate(
        { username, password },
        {
          onSuccess: (profile) => {
            router.push(profile.mustChangePassword ? "/change-password" : "/");
          },
        },
      );
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-4">
      <LoginBackgroundSpots />
      <Card className="relative z-10 w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="" width={64} height={64} />
            <h1 className="font-stencil text-lg font-semibold uppercase tracking-wide">
              {t("auth.appName")}
            </h1>
            <p className="text-center text-sm text-text-muted">{t("auth.loginTagline")}</p>
          </div>

          {!statusLoading && isBootstrap && (
            <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-center text-xs text-warning">
              {t("auth.bootstrapNotice")}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            {isBootstrap && (
              <FormField
                id="displayName"
                label={t("auth.yourName")}
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("auth.yourNamePlaceholder")}
              />
            )}
            <FormField
              id="username"
              label={t("auth.username")}
              type="text"
              autoFocus={!isBootstrap}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.usernamePlaceholder")}
            />
            <FormField
              id="password"
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-danger">
                {error instanceof ApiError ? error.message : t("auth.genericLoginError")}
              </p>
            )}

            <Button
              type="submit"
              disabled={
                pending || !username.trim() || !password.trim() || (isBootstrap && !displayName.trim())
              }
            >
              {pending ? t("auth.signingIn") : isBootstrap ? t("auth.createAdmin") : t("auth.signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
