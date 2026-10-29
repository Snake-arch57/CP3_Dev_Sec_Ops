"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Layers,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { getArcadeItems } from "@repo/shared/content";
import { scoreArcadeHit, GAME_CONFIG } from "@repo/shared/engine";
import type { ArcadeItem } from "@repo/shared/schemas";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MeterBadge } from "@/components/hud/MeterBadge";
import { Stamp } from "@/components/game/DecisionStamp";
import { BotaoSair } from "@/components/game/BotaoSair";
import { useSavePhaseResult } from "@/lib/hooks/usePlayerProfile";
import { cn, embaralhar } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// O id fica como está: é a chave gravada nos resultados já salvos no banco.
const DAY_ID = "arcade-caca-phishing";

/*
 * Um e-mail por vez, decidido arrastando o cartão para o lado.
 *
 * A versão anterior mostrava os 16 de uma vez e pedia para tocar só nos golpes.
 * Isso tinha dois problemas: o jogador nunca declarava nada sobre os e-mails
 * legítimos (só o silêncio contava como "achei que era de verdade"), e a
 * partida não tinha fim natural — precisou de um botão "Conferir", porque os
 * legítimos nunca eram tocados e a lista nunca se esgotava.
 *
 * Arrastando, toda carta recebe uma decisão explícita, a partida acaba quando
 * a pilha acaba, e o gesto é o mesmo que a pessoa faz no celular o dia inteiro.
 *
 * Esquerda = golpe. Direita = de verdade. Os botões e as setas do teclado fazem
 * o mesmo, para quem está no computador ou não consegue arrastar.
 */

const LIMIAR_ARRASTO = 110; // px percorridos que já valem como decisão
const LIMIAR_VELOCIDADE = 450; // px/s — um peteleco rápido decide antes do limiar

type Decisao = { item: ArcadeItem; disseGolpe: boolean; acertou: boolean };

export default function CacaGolpePage() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const savePhaseResult = useSavePhaseResult();
  const arcadeItems = getArcadeItems(locale);
  const reduzirMovimento = useReducedMotion();
  const hasSavedRef = useRef(false);
  const inicioRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<"intro" | "playing" | "results">("intro");
  const [items, setItems] = useState<ArcadeItem[]>([]);
  const [indice, setIndice] = useState(0);
  const [decisoes, setDecisoes] = useState<Decisao[]>([]);
  const [score, setScore] = useState(0);
  const [conceptCorrectCounts, setConceptCorrectCounts] = useState<Record<string, number>>({});
  const [carimbo, setCarimbo] = useState<{ label: string; cor: string } | null>(null);
  const [feedback, setFeedback] = useState<{ acertou: boolean; titulo: string; detalhe?: string } | null>(
    null,
  );

  // Posição horizontal do cartão. Tudo o mais (giro, sumiço, intensidade das
  // etiquetas) é derivado dela, então o dedo comanda a tela inteira.
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-14, 0, 14]);
  const opacidadeCartao = useTransform(x, [-360, -240, 0, 240, 360], [0, 1, 1, 1, 0]);
  const forcaGolpe = useTransform(x, [-140, -40], [1, 0]);
  const forcaReal = useTransform(x, [40, 140], [0, 1]);

  const atual = items[indice];
  const proximo = items[indice + 1];
  const decidindo = carimbo !== null;

  function start() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setItems(embaralhar(arcadeItems));
    setIndice(0);
    setDecisoes([]);
    setScore(0);
    setConceptCorrectCounts({});
    setCarimbo(null);
    setFeedback(null);
    x.set(0);
    hasSavedRef.current = false;
    setPhase("playing");
  }

  // Marca o início quando a partida entra em jogo. Fica num efeito, e não em
  // start(), porque ler o relógio durante a renderização não é puro.
  useEffect(() => {
    if (phase === "playing") inicioRef.current = Date.now();
  }, [phase]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const decidir = useCallback(
    (disseGolpe: boolean) => {
      if (phase !== "playing" || decidindo) return;
      const item = items[indice];
      if (!item) return;

      const acertou = disseGolpe === item.isPhishing;
      const resultado = scoreArcadeHit(acertou);
      setScore((s) => s + resultado.points);
      setDecisoes((d) => [...d, { item, disseGolpe, acertou }]);
      if (acertou) {
        setConceptCorrectCounts((prev) => ({ ...prev, [item.concept]: (prev[item.concept] ?? 0) + 1 }));
      }

      setCarimbo({
        label: disseGolpe ? t("minigames.stampScam") : t("minigames.stampReal"),
        cor: disseGolpe ? "var(--color-danger)" : "var(--color-success)",
      });
      setFeedback({
        acertou,
        titulo: acertou
          ? item.isPhishing
            ? t("minigames.feedbackCaughtScam")
            : t("minigames.feedbackCorrectReal")
          : item.isPhishing
            ? t("minigames.feedbackMissedScam")
            : t("minigames.feedbackFalseAlarm"),
        // A explicação só aparece quando erra: quem acertou não precisa parar
        // para ler, e a leitura completa fica no resultado.
        detalhe: acertou ? undefined : item.explanation,
      });

      const duracao = reduzirMovimento ? 0.01 : 0.28;
      animate(x, (disseGolpe ? -1 : 1) * 460, { duration: duracao, ease: "easeIn" });

      // Acabou a pilha, acabou a partida. Não há mais botão "Conferir": toda
      // carta recebeu uma decisão, então o fim é sabido aqui — e não num efeito
      // que observa o índice, que dispararia uma renderização em cascata.
      const proximoIndice = indice + 1;
      timerRef.current = setTimeout(
        () => {
          setCarimbo(null);
          x.set(0);
          if (proximoIndice >= items.length) setPhase("results");
          else setIndice(proximoIndice);
        },
        reduzirMovimento ? 260 : 560,
      );
    },
    [phase, decidindo, items, indice, reduzirMovimento, t, x],
  );

  // Setas do teclado: mesma decisão, para quem joga no computador.
  useEffect(() => {
    if (phase !== "playing") return;
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); decidir(true); }
      if (e.key === "ArrowRight") { e.preventDefault(); decidir(false); }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [phase, decidir]);

  const acertos = decisoes.filter((d) => d.acertou).length;
  const erros = decisoes.length - acertos;
  const escaparam = decisoes.filter((d) => !d.acertou && d.item.isPhishing).length;

  useEffect(() => {
    if (phase !== "results" || hasSavedRef.current) return;
    hasSavedRef.current = true;

    const timeUsedSeconds = Math.round((Date.now() - inicioRef.current) / 1000);
    const xpEarned = Math.max(0, score);
    const moneyEarned = Math.round(xpEarned * GAME_CONFIG.moneyConversionRate);

    savePhaseResult.mutate({
      dayId: DAY_ID,
      correctCount: acertos,
      wrongCount: erros,
      totalScore: score,
      xpEarned,
      moneyEarned,
      timeUsedSeconds,
      // Sempre 0: o combo saiu, mas a API ainda exige o campo.
      bestCombo: 0,
      conceptCorrectCounts,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "intro") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-warning" />
            <h1 className="font-stencil text-xl font-semibold uppercase tracking-wide">
              {t("minigames.cacaPhishingTitle")}
            </h1>
            <p className="text-sm text-text-muted">
              {t("minigames.cacaIntro", { count: arcadeItems.length })}
            </p>
            <div className="mt-1 flex w-full gap-2 text-xs">
              <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-2 py-2 text-danger">
                <ArrowLeft className="h-3.5 w-3.5" /> {t("minigames.markScam")}
              </div>
              <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-2 py-2 text-success">
                {t("minigames.markReal")} <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </div>
            </div>
            <Button size="lg" className="mt-1 w-full" onClick={start}>
              {t("minigames.start")}
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/minigames">
                <ArrowLeft className="h-4 w-4" /> {t("common.back")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "results") {
    const enganos = decisoes.filter((d) => !d.acertou);
    return (
      <div className="min-h-dvh bg-bg px-4 py-10">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <h1 className="font-stencil text-2xl font-semibold uppercase tracking-wide">
              {t("minigames.gameOver")}
            </h1>
            <p className="mt-1 text-text-muted">{t("minigames.cacaPhishingTitle")}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <span className="font-pixel text-lg">{acertos}</span>
                <span className="text-xs text-text-muted">{t("minigames.correct")}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <XCircle className="h-6 w-6 text-danger" />
                <span className="font-pixel text-lg">{erros}</span>
                <span className="text-xs text-text-muted">{t("minigames.wrong")}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span className="font-pixel text-lg">{escaparam}</span>
                <span className="text-xs text-text-muted">{t("minigames.missed")}</span>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardContent className="flex items-center justify-center py-5">
              <span className="text-sm text-text-muted">
                {t("minigames.score")} <span className="font-pixel text-xs text-text">{score}</span>
              </span>
            </CardContent>
          </Card>

          {/* A revisão é onde o jogo ensina: cada engano com o motivo ao lado. */}
          <h2 className="mt-8 font-stencil text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("minigames.reviewTitle")}
          </h2>
          {enganos.length === 0 ? (
            <p className="mt-2 text-sm text-text-muted">{t("minigames.reviewEmpty")}</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {enganos.map((d) => (
                <li
                  key={d.item.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm",
                    d.item.isPhishing ? "border-danger/40 bg-danger/10" : "border-warning/40 bg-warning/10",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {d.item.isPhishing ? (
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    ) : (
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text">{d.item.subject}</p>
                      <p className="truncate text-xs text-text-muted">{d.item.sender}</p>
                      <p className="mt-1.5 text-text-muted">{d.item.explanation}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/minigames")}>
              {t("common.back")}
            </Button>
            <Button className="flex-1" onClick={start}>
              {t("minigames.playAgain")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!atual) return null;

  return (
    <div className="min-h-dvh bg-bg pt-14">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <MeterBadge
          icon={Layers}
          label={t("minigames.cardCounter")}
          value={`${indice + 1}/${items.length}`}
        />
        <MeterBadge
          icon={CheckCircle2}
          label={t("minigames.points")}
          value={score}
          colorClassName="text-primary"
        />
        <div className="ml-auto">
          <BotaoSair para="/minigames" />
        </div>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-6">
        {/* Faixa de retorno: confirma o acerto sem travar o jogo e, quando erra,
            já entrega o motivo. Fica com altura reservada para a pilha não pular. */}
        <div className="min-h-[3.25rem]" aria-live="polite">
          {feedback && (
            <div
              className={cn(
                "flex gap-2 rounded-lg border p-3 text-sm",
                feedback.acertou
                  ? "border-success/40 bg-success/10 text-text"
                  : "border-warning/40 bg-warning/10 text-text",
              )}
            >
              {feedback.acertou ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
              )}
              <p>
                <span className="font-medium">{feedback.titulo}</span>
                {feedback.detalhe && <span className="text-text-muted"> {feedback.detalhe}</span>}
              </p>
            </div>
          )}
        </div>

        <div className="relative h-64">
          {/* Cartão de trás: mostra que a pilha continua. */}
          {proximo && (
            <div
              aria-hidden
              className="absolute inset-x-4 top-4 h-full rounded-sm border border-border bg-surface-2 opacity-60"
            />
          )}

          <motion.div
            className="absolute inset-0 cursor-grab touch-pan-y select-none rounded-sm border border-border bg-surface p-5 shadow-md shadow-black/10 active:cursor-grabbing"
            style={{ x, rotate: reduzirMovimento ? 0 : rotate, opacity: opacidadeCartao }}
            drag={decidindo ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -LIMIAR_ARRASTO || info.velocity.x < -LIMIAR_VELOCIDADE) decidir(true);
              else if (info.offset.x > LIMIAR_ARRASTO || info.velocity.x > LIMIAR_VELOCIDADE) decidir(false);
              else animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
            }}
          >
            {/* Etiquetas que acendem conforme o dedo escolhe o lado. */}
            <motion.span
              aria-hidden
              style={{ opacity: forcaGolpe }}
              className="absolute left-4 top-4 rounded-md border-2 border-danger px-2 py-1 font-pixel text-[10px] uppercase tracking-widest text-danger"
            >
              {t("minigames.stampScam")}
            </motion.span>
            <motion.span
              aria-hidden
              style={{ opacity: forcaReal }}
              className="absolute right-4 top-4 rounded-md border-2 border-success px-2 py-1 font-pixel text-[10px] uppercase tracking-widest text-success"
            >
              {t("minigames.stampReal")}
            </motion.span>

            <motion.div
              key={atual.id}
              initial={reduzirMovimento ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
              className="flex h-full flex-col justify-center gap-3 pt-8"
            >
              <p className="break-words text-sm text-text-muted">{atual.sender}</p>
              <p className="break-words text-lg font-medium leading-snug text-text">{atual.subject}</p>
            </motion.div>

            <Stamp label={carimbo?.label ?? null} colorVar={carimbo?.cor ?? ""} />
          </motion.div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            disabled={decidindo}
            onClick={() => decidir(true)}
          >
            <ShieldAlert className="h-4 w-4" /> {t("minigames.markScam")}
          </Button>
          <Button
            variant="success"
            size="lg"
            className="flex-1"
            disabled={decidindo}
            onClick={() => decidir(false)}
          >
            <ShieldCheck className="h-4 w-4" /> {t("minigames.markReal")}
          </Button>
        </div>

        <p className="text-center text-xs text-text-muted">{t("minigames.swipeHint")}</p>
      </div>
    </div>
  );
}
