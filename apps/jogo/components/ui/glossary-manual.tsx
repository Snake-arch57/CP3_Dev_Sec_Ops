"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  Bug,
  ChevronLeft,
  ChevronRight,
  Globe,
  Headset,
  KeyRound,
  List,
  Lock,
  Mail,
  MessageCircle,
  Paperclip,
  QrCode,
  Receipt,
  ShieldCheck,
  Skull,
  Truck,
  Usb,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { playPageTurnSound } from "@/lib/sound";
import { Book } from "./book";

const TERM_ICON: Record<string, LucideIcon> = {
  phishing: Mail,
  engenharia_social: Users,
  malware: Bug,
  ransomware: Lock,
  qr_falso: QrCode,
  senha_fraca: KeyRound,
  mfa: ShieldCheck,
  usb_infectado: Usb,
  whatsapp_falso: MessageCircle,
  microsoft_falso: Headset,
  fornecedor_comprometido: Truck,
  pix_falso: Banknote,
  boleto_adulterado: Receipt,
  deepfake: Video,
  anexo_perigoso: Paperclip,
  certificado_digital: BadgeCheck,
  dominio_falso: Globe,
};

/**
 * O manual é uma pilha de folhas: capa, índice e uma folha por termo.
 *
 * Antes existiam "páginas duplas" fixas e a folha da direita era escondida por
 * CSS no celular. O efeito era que, em tela estreita, o índice inteiro e todos
 * os termos de posição ímpar ficavam inalcançáveis — metade do glossário
 * simplesmente não existia no telefone. Tratar tudo como uma lista de folhas e
 * variar quantas cabem por vez (1 no celular, 2 no desktop) faz o mesmo
 * conteúdo servir aos dois tamanhos.
 */
type Leaf = { kind: "cover" } | { kind: "toc" } | { kind: "term"; index: number };

const LEAVES: Leaf[] = [
  { kind: "cover" },
  { kind: "toc" },
  ...GLOSSARY_TERMS.map((_, index) => ({ kind: "term" as const, index })),
];

/** Posição da folha de índice e da primeira folha de termo dentro de LEAVES. */
const TOC_LEAF = 1;
const FIRST_TERM_LEAF = 2;

function useLeavesPerView() {
  // Começa em 1 (celular) para nunca renderizar duas folhas numa tela que só
  // comporta uma; o efeito corrige para 2 antes da primeira abertura.
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setPerView(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return perView;
}

const pageVariants = {
  enterFromRight: { x: 40, opacity: 0 },
  enterFromLeft: { x: -40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -40, opacity: 0 },
  exitToRight: { x: 40, opacity: 0 },
};

const pageTransition = {
  type: "tween" as const,
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

function Separator() {
  return (
    <div className="mx-auto flex items-center gap-2" aria-hidden>
      <span className="h-px w-8 bg-border" />
      <Skull className="h-3 w-3 text-primary" />
      <span className="h-px w-8 bg-border" />
    </div>
  );
}

function TermPage({ index }: { index: number }) {
  const { locale } = useLocale();
  const term = GLOSSARY_TERMS[index];

  if (!term) return null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-5 sm:p-6">
      <header className="shrink-0 text-center">
        <h3 className="font-stencil text-xl font-semibold uppercase leading-tight tracking-wide text-text sm:text-2xl">
          {term.term[locale]}
        </h3>
        <div className="mt-2">
          <Separator />
        </div>
      </header>

      <p className="shrink-0 text-center text-sm leading-relaxed text-text-muted sm:text-base">
        {term.definition[locale]}
      </p>

      {/* min-h-0 é o que deixa a imagem encolher em telas baixas, em vez de
          empurrar o número da página para fora da folha. */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/glossary/${term.id}.png`}
          alt=""
          className="max-h-full max-w-full rounded-md border border-border object-contain"
          loading="lazy"
        />
      </div>

      <p className="shrink-0 text-center font-stencil text-xs tracking-widest text-text-muted">
        {index + 1} / {GLOSSARY_TERMS.length}
      </p>
    </div>
  );
}

function CoverPage() {
  const { t } = useLocale();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center sm:p-8">
      <Skull className="h-16 w-16 text-primary sm:h-20 sm:w-20" strokeWidth={1.25} />
      <h2 className="font-stencil text-2xl font-semibold uppercase tracking-wide text-text sm:text-3xl">
        {t("glossary.title")}
      </h2>
      <Separator />
      <p className="max-w-sm text-sm leading-relaxed text-text-muted sm:text-base">
        {t("glossary.subtitle")}
      </p>
    </div>
  );
}

function TableOfContents({ onGoToTerm }: { onGoToTerm: (termIndex: number) => void }) {
  const { locale } = useLocale();
  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6">
      <h3 className="shrink-0 text-center font-stencil text-lg font-semibold uppercase tracking-wide text-text">
        Índice
      </h3>
      <div className="mb-2 mt-3 h-px w-full shrink-0 bg-border" />

      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {GLOSSARY_TERMS.map((term, i) => {
          const Icon = TERM_ICON[term.id] ?? Mail;
          return (
            <li key={term.id}>
              <button
                type="button"
                onClick={() => onGoToTerm(i)}
                // min-h-11: alvo de toque confortável no celular.
                className="flex min-h-11 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm text-text transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                <span className="truncate">{term.term[locale]}</span>
                <span className="relative top-px flex-1 border-b border-dashed border-border" aria-hidden />
                <span className="shrink-0 font-stencil text-xs text-text-muted">{i + 1}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LeafView({ leaf, onGoToTerm }: { leaf: Leaf; onGoToTerm: (i: number) => void }) {
  if (leaf.kind === "cover") return <CoverPage />;
  if (leaf.kind === "toc") return <TableOfContents onGoToTerm={onGoToTerm} />;
  return <TermPage index={leaf.index} />;
}

export function GlossaryManual() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [leaf, setLeaf] = useState(0);
  const [direction, setDirection] = useState(0);
  const perView = useLeavesPerView();

  // Guardar a folha (e não a "página dupla") mantém o lugar do leitor quando a
  // tela muda de largura, por exemplo ao girar o telefone.
  const viewStart = Math.floor(leaf / perView) * perView;
  const visible = LEAVES.slice(viewStart, viewStart + perView);
  const totalViews = Math.ceil(LEAVES.length / perView);
  const viewIndex = Math.floor(viewStart / perView);
  const canGoPrev = viewStart > 0;
  const canGoNext = viewStart + perView < LEAVES.length;

  const goNext = useCallback(() => {
    if (viewStart + perView >= LEAVES.length) return;
    setDirection(1);
    setLeaf(viewStart + perView);
    playPageTurnSound();
  }, [viewStart, perView]);

  const goPrev = useCallback(() => {
    if (viewStart <= 0) return;
    setDirection(-1);
    setLeaf(Math.max(0, viewStart - perView));
    playPageTurnSound();
  }, [viewStart, perView]);

  const goToTerm = useCallback(
    (termIndex: number) => {
      const target = FIRST_TERM_LEAF + termIndex;
      setDirection(target > viewStart ? 1 : -1);
      setLeaf(target);
      playPageTurnSound();
    },
    [viewStart],
  );

  const goToToc = useCallback(() => {
    setDirection(TOC_LEAF > viewStart ? 1 : -1);
    setLeaf(TOC_LEAF);
    playPageTurnSound();
  }, [viewStart]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          setLeaf(0);
          setDirection(0);
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("glossary.openManual")}
          className="group fixed bottom-5 right-5 z-[70] focus-visible:outline-none"
        >
          <Book width={52} depth={7}>
            <Skull className="h-5 w-5 text-bg" />
          </Book>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="glossary-overlay fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          className="glossary-content fixed left-1/2 top-1/2 z-[90] w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t("glossary.title")}</Dialog.Title>

          {/* Capa do manual: petróleo, a superfície institucional da identidade. */}
          <div className="glossary-book-cover relative rounded-xl border border-border bg-campo p-2 shadow-2xl shadow-black/50 sm:p-3">
            <Dialog.Close
              aria-label={t("glossary.close")}
              className="absolute -right-2 -top-2 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text shadow-lg transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {/* Miolo. No celular é retrato e alto; no desktop, a página dupla. */}
            <div className="relative h-[72vh] max-h-[620px] w-full overflow-hidden rounded-lg bg-surface sm:aspect-[4/3] sm:h-auto sm:max-h-[78vh]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={viewStart}
                  variants={pageVariants}
                  initial={direction >= 0 ? "enterFromRight" : "enterFromLeft"}
                  animate="center"
                  exit={direction >= 0 ? "exitToLeft" : "exitToRight"}
                  transition={pageTransition}
                  className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2"
                >
                  {visible.map((l, i) => (
                    <div
                      key={`${viewStart}-${i}`}
                      className={cn(
                        "relative min-h-0",
                        i === 0 && perView === 2 && "border-r border-border",
                      )}
                    >
                      <LeafView leaf={l} onGoToTerm={goToTerm} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Setas laterais só onde há margem para elas. */}
            {canGoPrev && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Página anterior"
                className="absolute -left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-lg transition-colors hover:bg-surface-2 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {canGoNext && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Próxima página"
                className="absolute -right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-lg transition-colors hover:bg-surface-2 sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Barra de controle: no celular é a única navegação, então os alvos
              são grandes e ficam abaixo do manual, ao alcance do polegar. */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Página anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:bg-surface-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToToc}
              className="flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 font-stencil text-sm uppercase tracking-wide text-text transition-colors hover:bg-surface-2"
            >
              <List className="h-4 w-4 text-primary" />
              Índice
            </button>

            <span className="min-w-14 text-center font-stencil text-sm tabular-nums text-text-muted">
              {viewIndex + 1}/{totalViews}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Próxima página"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:bg-surface-2 disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
