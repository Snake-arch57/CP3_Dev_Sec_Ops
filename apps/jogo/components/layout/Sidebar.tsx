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

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { data: profile } = usePlayerProfile();
  const navItems =
    profile?.role === "ADMIN"
      ? [...NAV_ITEMS, { href: "/admin", labelKey: "nav.admin", icon: ShieldCheck }]
      : NAV_ITEMS;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 py-5">
        <Image src="/logo.png" alt="" width={40} height={40} />
        <span className="font-stencil text-lg font-semibold uppercase tracking-wide">Hackudinhos</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-nav-active"
                  className="absolute inset-0 rounded-lg bg-primary/15"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <motion.span
                className="relative z-10 flex items-center justify-center"
                animate={{ scale: isActive ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
              >
                <Icon className="h-4 w-4" />
              </motion.span>
              <span className="relative z-10">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs text-text-muted">{t("nav.tagline")}</div>
    </aside>
  );
}
