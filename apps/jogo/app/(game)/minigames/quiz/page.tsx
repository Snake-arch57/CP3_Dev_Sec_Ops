"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { getQuizQuestions } from "@repo/shared/content";
import { scoreQuizAnswer, GAME_CONFIG } from "@repo/shared/engine";
import type { QuizQuestion } from "@repo/shared/schemas";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MeterBadge } from "@/components/hud/MeterBadge";
import { BotaoSair } from "@/components/game/BotaoSair";
import { useSavePhaseResult } from "@/lib/hooks/usePlayerProfile";
import { cn, embaralhar } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const DAY_ID = "quiz-seguranca";

/*
 * Sem cronômetro por pergunta, sem bônus por velocidade e sem combo.
 *
 * E uma mudança que não era de mecânica, mas pesava tanto quanto: a explicação
 * aparecia por 2,2 segundos e o quiz avançava sozinho. A parte que ensina — o
 * porquê da resposta — sumia antes de dar tempo de ler. Agora a pessoa avança
 * quando quiser, pelo botão.
 */

/**
 * Embaralha as alternativas de uma pergunta e reaponta a resposta certa.
 *
 * No conteúdo escrito à mão, a resposta certa caiu na segunda alternativa em
 * 11 das 12 perguntas. Sem embaralhar, quem percebe o padrão gabarita sem ler
 * — e um quiz que premia contar posição não ensina nada.
 *
 * Embaralha a ORDEM dos índices, e não a lista de textos, para reencontrar a
 * resposta certa pela posição original. Procurar pelo texto quebraria se duas
 * alternativas fossem iguais.
 */
function embaralharAlternativas(q: QuizQuestion): QuizQuestion {
  const ordem = embaralhar(q.options.map((_, i) => i));
  return {
    ...q,
    options: ordem.map((i) => q.options[i]!),
    correctIndex: ordem.indexOf(q.correctIndex),
  };
}

export default function QuizPage() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const savePhaseResult = useSavePhaseResult();
  const quizQuestions = getQuizQuestions(locale);
  const hasSavedRef = useRef(false);
  // Início da partida, para gravar o tempo real — antes gravava-se
  // "perguntas × 15s", que era o limite, não o tempo usado.
  const inicioRef = useRef(0);

  const [phase, setPhase] = useState<"intro" | "playing" | "results">("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [conceptCorrectCounts, setConceptCorrectCounts] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedIndex !== null;

  function start() {
    setQuestions(embaralhar(quizQuestions).map(embaralharAlternativas));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setConceptCorrectCounts({});
    hasSavedRef.current = false;
    setPhase("playing");
  }

  // Marca o início quando a partida entra em jogo. Fica num efeito, e não em
  // start(), porque ler o relógio durante a renderização não é puro — e o
  // lint do React não tem como provar que start() só roda num clique.
  useEffect(() => {
    if (phase === "playing") inicioRef.current = Date.now();
  }, [phase]);

  function answer(index: number) {
    if (isAnswered || !currentQuestion) return;
    setSelectedIndex(index);
    const correct = index === currentQuestion.correctIndex;
    const result = scoreQuizAnswer(correct);
    setScore((s) => s + result.points);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setConceptCorrectCounts((prev) => ({
        ...prev,
        [currentQuestion.concept]: (prev[currentQuestion.concept] ?? 0) + 1,
      }));
    } else {
      setWrongCount((c) => c + 1);
    }
  }

  const ehUltima = currentIndex + 1 >= questions.length;

  function avancar() {
    if (ehUltima) {
      setPhase("results");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
  }

  useEffect(() => {
    if (phase !== "results" || hasSavedRef.current) return;
    hasSavedRef.current = true;

    const xpEarned = Math.max(0, score);
    const moneyEarned = Math.round(xpEarned * GAME_CONFIG.moneyConversionRate);
    const timeUsedSeconds = Math.round((Date.now() - inicioRef.current) / 1000);

    savePhaseResult.mutate({
      dayId: DAY_ID,
      correctCount,
      wrongCount,
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
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="font-stencil text-xl font-semibold uppercase tracking-wide">
              {t("minigames.quizTitle")}
            </h1>
            <p className="text-sm text-text-muted">
              {t("minigames.quizIntroDescription", { count: quizQuestions.length })}
            </p>
            <Button size="lg" className="mt-2 w-full" onClick={start}>
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
    return (
      <div className="min-h-dvh bg-bg px-4 py-10">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <h1 className="font-stencil text-2xl font-semibold uppercase tracking-wide">
              {t("minigames.gameOver")}
            </h1>
            <p className="mt-1 text-text-muted">{t("minigames.quizTitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <span className="font-pixel text-lg">{correctCount}</span>
                <span className="text-xs text-text-muted">{t("minigames.correct")}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <XCircle className="h-6 w-6 text-danger" />
                <span className="font-pixel text-lg">{wrongCount}</span>
                <span className="text-xs text-text-muted">{t("minigames.wrong")}</span>
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

  if (!currentQuestion) return null;

  return (
    <div className="min-h-dvh bg-bg pt-14">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <MeterBadge
          icon={Brain}
          label={t("minigames.question")}
          value={`${currentIndex + 1}/${questions.length}`}
        />
        <MeterBadge icon={CheckCircle2} label={t("minigames.points")} value={score} colorClassName="text-primary" />
        <div className="ml-auto">
          <BotaoSair para="/minigames" />
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <Card>
          <CardContent className="py-6">
            <p className="text-lg font-medium text-text">{currentQuestion.question}</p>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, i) => {
            const isCorrectOption = i === currentQuestion.correctIndex;
            const isSelected = selectedIndex === i;
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 text-left text-sm transition-colors",
                  !isAnswered && "border-border bg-surface hover:border-primary hover:bg-surface-2",
                  isAnswered && isCorrectOption && "border-success/50 bg-success/10",
                  isAnswered && isSelected && !isCorrectOption && "border-danger/50 bg-danger/10",
                  isAnswered && !isSelected && !isCorrectOption && "border-border bg-surface opacity-60",
                )}
              >
                <span>{option}</span>
                {isAnswered && isCorrectOption && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="h-4 w-4 shrink-0 text-danger" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <>
            <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-text">
              <Lightbulb className="h-4 w-4 shrink-0 text-warning" />
              <p>{currentQuestion.explanation}</p>
            </div>
            <Button size="lg" onClick={avancar}>
              {ehUltima ? t("minigames.seeResult") : t("minigames.next")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
