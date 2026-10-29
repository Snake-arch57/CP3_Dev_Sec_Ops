"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ListChecks,
  ShoppingBag,
  User,
  Trophy,
  BarChart3,
  Settings,
  ShieldCheck,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LofiPlayer } from "@/components/ui/lofi-player";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/phases", labelKey: "nav.phases", icon: ListChecks },
  { href: "/minigames", labelKey: "nav.minigames", icon: Gamepad2 },
  { href: "/shop", labelKey: "nav.shop", icon: ShoppingBag },
  { href: "/profile", labelKey: "nav.profile", icon: User },
  { href: "/achievements", labelKey: "nav.achievements", icon: Trophy },
  { href: "/ranking", labelKey: "nav.ranking", icon: BarChart3 },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function MobileTopBar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const navItems =
    profile?.role === "ADMIN"
      ? [...NAV_ITEMS, { href: "/admin", labelKey: "nav.admin", icon: ShieldCheck }]
      : NAV_ITEMS;

  return (
    <div className="md:hidden sticky top-0 z-20 border-b border-border bg-surface">
      {/*
        Os controles moram aqui no celular. Antes flutuavam em `fixed right-4
        top-4` vindos do layout raiz, o que os punha por cima desta barra e os
        cortava na borda da tela. `min-w-0` no nome deixa ele truncar em vez de
        empurrar os botões para fora.
      */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Image src="/logo.png" alt="" width={40} height={40} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate font-stencil font-semibold uppercase tracking-wide">
          Hackudinhos
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <LofiPlayer />
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex gap-1.5 overflow-x-auto px-3 pb-2.5">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href;
          const label = t(labelKey);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-xl bg-primary/15"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <motion.span
                className="relative z-10 flex items-center justify-center"
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive ? "text-primary" : "text-text-muted",
                  )}
                />
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
