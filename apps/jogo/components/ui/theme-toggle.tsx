"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export type Theme = "light" | "dark";

const STORAGE_KEY = "hackudinhos-theme";
const CURTAIN_MS = 480;
// A cortina cobre a tela durante a troca de tema, entao precisa ser a cor de
// fundo de destino. Sao os valores de --color-bg dos dois temas, repetidos
// aqui porque a animacao roda antes da classe .dark trocar.
const CURTAIN_COLOR: Record<Theme, string> = {
  light: "#F2F4F3", // papel
  dark: "#1B1D21",  // chumbo
};

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useLocale();
  const [theme, setTheme] = useState<Theme>("dark");
  const [phase, setPhase] = useState<"idle" | "falling" | "rising">("idle");
  const curtainColorRef = useRef(CURTAIN_COLOR.dark);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    if (phase !== "idle") return;
    const next: Theme = theme === "light" ? "dark" : "light";
    curtainColorRef.current = CURTAIN_COLOR[next];
    setPhase("falling");

    setTimeout(() => {
      applyThemeClass(next);
      localStorage.setItem(STORAGE_KEY, next);
      setTheme(next);
      setPhase("rising");
      setTimeout(() => setPhase("idle"), CURTAIN_MS + 40);
    }, CURTAIN_MS);
  }, [phase, theme]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          background: curtainColorRef.current,
          transformOrigin: "top",
          transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
          transition: phase !== "idle" ? `transform ${CURTAIN_MS}ms cubic-bezier(0.76,0,0.24,1)` : "none",
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "light" ? t("nav.enableDarkMode") : t("nav.enableLightMode")}
        aria-pressed={theme === "dark"}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >
        <Sun
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            theme === "light" ? "text-warning" : "text-text-muted/40",
          )}
        />

        {/* a alavanca: bola numa haste montada na diagonal sobre uma placa quadrada */}
        <span className="relative h-9 w-9 shrink-0">
          <span
            className="absolute bottom-1 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full blur-[3px]"
            style={{ background: "color-mix(in srgb, black 45%, transparent)" }}
          />

          {/* placa/base quadrada onde a alavanca é montada */}
          <span
            className="absolute bottom-0.5 left-1/2 h-7 w-7 -translate-x-1/2 rounded-[6px] border shadow-inner shadow-black/20"
            style={{
              borderColor: "var(--color-border)",
              background:
                "linear-gradient(155deg, var(--color-surface-2) 0%, var(--color-surface-3) 100%)",
            }}
          >
            {/* rebaixo/entalhe da placa */}
            <span
              className="absolute inset-1 rounded-[3px]"
              style={{ background: "color-mix(in srgb, black 18%, transparent)" }}
            />
          </span>

          <span className="absolute bottom-[13px] left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-border" />
          <motion.span
            className="absolute bottom-[13px] left-1/2 z-10 h-5 w-1.5 -translate-x-1/2 rounded-full"
            style={{
              transformOrigin: "bottom center",
              background: "linear-gradient(180deg, #d8dbe0 0%, #9a9fa8 60%, #8a8f98 100%)",
            }}
            animate={{ rotate: theme === "dark" ? 40 : -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
          >
            <span
              className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-black/10 shadow-md shadow-black/50"
              style={{
                background:
                  theme === "dark"
                    ? "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--color-primary) 70%, white) 0%, var(--color-primary) 50%, var(--color-primary-hover) 100%)"
                    : "radial-gradient(circle at 35% 30%, #ffe08a 0%, var(--color-warning) 55%, color-mix(in srgb, var(--color-warning) 70%, black) 100%)",
              }}
            />
          </motion.span>
        </span>

        <Moon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            theme === "dark" ? "text-primary" : "text-text-muted/40",
          )}
        />
      </button>
    </>
  );
}
