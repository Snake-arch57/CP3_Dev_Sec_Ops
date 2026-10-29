"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  locked?: boolean;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

/**
 * Geometria do carrossel.
 *
 * A primeira tentativa de adaptar ao celular foi só encolher o raio. Não
 * funcionou: os sete cartões continuaram sendo desenhados e, com pouco espaço,
 * empilharam no centro num bolo ilegível. Espremer geometria circular não a
 * torna adequada a uma tela estreita — o que muda é QUANTOS cartões existem.
 *
 * Então a contagem de visíveis é que responde à largura:
 *   - tela larga  → cinco cartões, o efeito circular como foi desenhado
 *   - tela média  → três
 *   - celular     → um só, centralizado e legível, navegando pelas setas
 *
 * Com um cartão só o arco não faz sentido, então o deslocamento vertical
 * também zera: ele fica reto no meio da pista.
 */
const RADIUS_X_MAX = 220;
const RADIUS_Y_MAX = 100;

type Geometria = { visiveis: number; raioX: number; raioY: number };

function geometriaPara(largura: number): Geometria {
  // Sem medida ainda (primeiro render): assume o layout completo.
  if (!largura) return { visiveis: 5, raioX: RADIUS_X_MAX, raioY: RADIUS_Y_MAX };

  if (largura < 520) {
    return { visiveis: 1, raioX: 0, raioY: 0 };
  }

  if (largura < 720) {
    return { visiveis: 3, raioX: Math.min(RADIUS_X_MAX, largura * 0.26), raioY: RADIUS_Y_MAX * 0.6 };
  }

  return { visiveis: 5, raioX: RADIUS_X_MAX, raioY: RADIUS_Y_MAX };
}

function getItemPosition(
  index: number,
  activeIndex: number,
  total: number,
  g: Geometria,
) {
  const offset = index - activeIndex;
  const half = Math.floor(g.visiveis / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  // Com `visiveis: 1`, half é 0 e só o cartão ativo sobrevive a esta linha.
  if (Math.abs(adjustedOffset) > half) return null;

  const angle = g.visiveis > 1 ? (adjustedOffset / g.visiveis) * Math.PI : 0;
  const x = Math.sin(angle) * g.raioX;
  const y = g.raioY ? -Math.cos(angle) * g.raioY + g.raioY : 0;

  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 1;
  const scale = Math.max(0, 1 - (distance / maxDistance) * 0.3);
  const opacity = Math.max(0.35, 1 - (distance / maxDistance) * 0.65);
  const zIndex = g.visiveis - distance;

  return { x, y, scale, opacity, zIndex, adjustedOffset };
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
}: CircularCarouselProps) {
  const { t } = useLocale();
  const [internalIndex, setInternalIndex] = useState(0);

  // Largura real da pista, para o raio dos cartões acompanhar a tela.
  // ResizeObserver em vez de window.innerWidth porque o que importa é o
  // espaço deste container, que muda também quando a barra lateral aparece.
  const pistaRef = useRef<HTMLDivElement>(null);
  const [larguraPista, setLarguraPista] = useState(0);

  useEffect(() => {
    const el = pistaRef.current;
    if (!el) return;
    const observador = new ResizeObserver(([entrada]) => {
      setLarguraPista(entrada.contentRect.width);
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const geometria = geometriaPara(larguraPista);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      const newIndex = ((index % total) + total) % total;
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex);
      }
      onActiveChange?.(newIndex);
    },
    [total, controlledIndex, onActiveChange],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [next, prev]);

  const activeItem = items[activeIndex];
  if (!activeItem) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={t("mainPages.carouselAriaLabel")}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-6 outline-none",
        className,
      )}
    >
      <div
        ref={pistaRef}
        className="relative w-full max-w-lg overflow-hidden"
        style={{ height: geometria.visiveis === 1 ? 210 : 260 }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const pos = getItemPosition(i, activeIndex, total, geometria);
            if (!pos) return null;

            const isActive = i === activeIndex;

            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goTo(i)}
                aria-label={item.title}
                aria-selected={isActive}
                role="option"
                className={cn(
                  "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-between rounded-lg border p-4 backdrop-blur-sm transition-shadow duration-300",
                  geometria.visiveis === 1 ? "h-44 w-[17rem]" : "h-32 w-48",
                  "border-border bg-gradient-to-b from-surface to-surface-2",
                  isActive
                    ? "shadow-[0_16px_40px_-8px_rgba(0,0,0,0.35)]"
                    : "shadow-[0_6px_16px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.3)]",
                  item.locked && "opacity-70",
                )}
                style={{ transformOrigin: "center center" }}
              >
                <div className="flex w-full items-center justify-between">
                  {item.tag && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                      {item.tag}
                    </span>
                  )}
                  {item.locked && <Lock className="h-3.5 w-3.5 text-text-muted" />}
                </div>
                <div className="w-full">
                  <h3
                    className={cn(
                      "font-stencil leading-tight transition-colors duration-300",
                      geometria.visiveis === 1
                        ? "text-lg text-text"
                        : isActive
                          ? "text-base text-text"
                          : "text-sm text-text-muted",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-xs leading-relaxed transition-colors duration-300",
                      geometria.visiveis === 1 ? "line-clamp-4" : "line-clamp-2",
                      isActive ? "text-text-muted" : "text-text-muted/70",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "pointer-events-none absolute inset-0 flex-col items-center justify-center",
            // Só faz sentido no arco: com um cartão só, o miolo é o cartão, e
            // o número ficava impresso por cima do texto dele.
            geometria.visiveis === 1 ? "hidden" : "flex",
          )}
        >
          <span className="font-pixel text-2xl text-text/90">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="mt-2 text-xs text-text-muted">
            {t("mainPages.carouselOf", { total: String(total).padStart(2, "0") })}
          </span>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label={t("mainPages.carouselPrevious")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted backdrop-blur-sm transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="size-5" />
        </motion.button>

        <div className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-text-muted",
              )}
              aria-label={t("mainPages.carouselGoTo", { number: i + 1 })}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          aria-label={t("mainPages.carouselNext")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted backdrop-blur-sm transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight className="size-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;
