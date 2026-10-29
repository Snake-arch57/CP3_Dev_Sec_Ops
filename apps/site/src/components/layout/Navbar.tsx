"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Marca } from "./Marca";

const SECOES = [
  { href: "/senha", n: "01", label: "Senha" },
  { href: "/golpe", n: "02", label: "Golpe" },
  { href: "/anatomia", n: "03", label: "Anatomia" },
  { href: "/ia", n: "04", label: "IA" },
  { href: "/agora", n: "05", label: "Agora" },
];

const SECUNDARIOS = [
  { href: "/treinamento", label: "Treinamento" },
  { href: "/glossario", label: "Glossário" },
  { href: "/no-trabalho", label: "No trabalho" },
  { href: "/sobre", label: "Sobre o projeto" },
];

export function Navbar() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-chumbo-linha bg-chumbo/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Marca size={24} />
          <span className="sr-only">Início</span>
        </Link>

        {/* A barra completa só cabe a partir de xl. Abaixo disso tudo vai para
            o menu recolhido — que contém SECOES e SECUNDARIOS inteiros, para
            nenhuma página ficar inalcançável, como já aconteceu com
            /no-trabalho quando ela só existia no array secundário. */}
        <nav aria-label="Seções" className="hidden items-center gap-1 xl:flex">
          {SECOES.map((s) => {
            const ativo = pathname === s.href;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex min-h-touch items-center gap-2 rounded-sm px-3 font-display text-sm transition-colors duration-200",
                  ativo
                    ? "text-papel"
                    : "text-papel-2 hover:bg-chumbo-painel hover:text-papel",
                )}
              >
                <span
                  className={cn(
                    "text-[0.6875rem]",
                    ativo ? "text-menta" : "text-papel-3",
                  )}
                >
                  {s.n}
                </span>
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1 xl:flex">
          {SECUNDARIOS.filter((s) => s.href !== "/sobre").map((s) => (
            <Link
              key={s.href}
              href={s.href}
              aria-current={pathname === s.href ? "page" : undefined}
              className={cn(
                "flex min-h-touch items-center rounded-sm px-3 font-display text-sm transition-colors duration-200",
                pathname === s.href
                  ? "text-papel"
                  : "text-papel-2 hover:bg-chumbo-painel hover:text-papel",
              )}
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/ja-cai"
            className="ml-1 flex min-h-touch items-center rounded-sm bg-ambar px-4 font-display text-sm font-medium text-chumbo transition-colors duration-200 hover:bg-[#F5BB63]"
          >
            Já caí num golpe
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-sm border border-chumbo-linha px-4 font-display text-sm text-papel xl:hidden"
        >
          {aberto ? "Fechar" : "Menu"}
        </button>
      </div>

      {aberto && (
        <div
          id="menu-mobile"
          className="border-t border-chumbo-linha bg-chumbo xl:hidden"
        >
          <div className="container-page flex flex-col py-3">
            <Link
              href="/ja-cai"
              className="mb-2 flex min-h-touch items-center rounded-sm bg-ambar px-4 font-display text-sm font-medium text-chumbo"
            >
              Já caí num golpe
            </Link>

            {SECOES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                aria-current={pathname === s.href ? "page" : undefined}
                className="flex min-h-touch items-center gap-3 border-b border-chumbo-linha font-display text-base text-papel"
              >
                <span className="text-xs text-papel-3">{s.n}</span>
                {s.label}
              </Link>
            ))}

            {SECUNDARIOS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex min-h-touch items-center border-b border-chumbo-linha font-display text-base text-papel-2 last:border-b-0"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
