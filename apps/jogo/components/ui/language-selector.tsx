"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/locale";

function FlagBR() {
  return (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 shrink-0 rounded-[2px]">
      <rect width="20" height="14" fill="#2e7d32" />
      <polygon points="10,2 18,7 10,12 2,7" fill="#fdd835" />
      <circle cx="10" cy="7" r="3" fill="#1565c0" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 shrink-0 rounded-[2px]">
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="2" fill="#c0392b" />
      ))}
      <rect width="9" height="8" fill="#2c3e73" />
    </svg>
  );
}

const LANGUAGES: { code: Locale; label: string; Flag: () => React.JSX.Element }[] = [
  { code: "pt", label: "Português", Flag: FlagBR },
  { code: "en", label: "English", Flag: FlagUS },
];

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  const current = LANGUAGES.find((lang) => lang.code === locale)!;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("nav.selectLanguage")}
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm text-text shadow-md shadow-black/10 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <current.Flag />
        <ChevronDown className={cn("h-3.5 w-3.5 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-lg shadow-black/20"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2",
                  lang.code === locale ? "text-primary" : "text-text",
                )}
              >
                <lang.Flag />
                <span className="flex-1">{lang.label}</span>
                {lang.code === locale && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
