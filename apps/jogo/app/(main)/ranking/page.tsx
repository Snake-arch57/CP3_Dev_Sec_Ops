"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRanking } from "@/lib/hooks/useRanking";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Placar por SETOR — nunca por pessoa (exigência de LGPD).
 *
 * Não aparece nome de ninguém, nem a posição de ninguém. Só o setor e a
 * pontuação somada. A única linha destacada é a do setor do próprio jogador,
 * que ele já sabe qual é.
 *
 * A exceção é o setor de turma usado em aula: a linha dele abre e mostra o
 * placar aluno a aluno, porque ali a disputa nominal é o objetivo didático e
 * as contas são pseudônimas, criadas para a aula. Todos os outros setores
 * continuam fechados e somados, na mesma tela.
 *
 * Quem pode abrir é decidido pela API, não aqui: ela só manda `individual`
 * para quem é da turma ou é administrador. Ver
 * `apps/api/src/ranking/ranking.service.ts`.
 */
export default function RankingPage() {
  const { t } = useLocale();
  const { data, isLoading } = useRanking();
  const [turmaAberta, setTurmaAberta] = useState(false);
  const semMovimento = useReducedMotion();

  const turma = data?.individual ?? null;

  return (
    <div>
      <PageHeader
        title={t("mainPages.rankingTitle")}
        description={t(turma ? "mainPages.rankingClassDescription" : "mainPages.rankingDescription")}
      />
      <Card>
        <CardContent className="py-2">
          {isLoading && <p className="py-6 text-center text-sm text-text-muted">{t("common.loading")}</p>}
          {!isLoading && data?.entries.length === 0 && (
            <p className="py-6 text-center text-sm text-text-muted">{t("mainPages.noOnePlayedYet")}</p>
          )}

          <ul className="divide-y divide-border">
            {data?.entries.map((entry) => {
              const isCurrent = entry.department === data.currentDepartment;
              const abrivel = turma?.department === entry.department;

              // A linha da turma é um botão; as demais continuam texto puro,
              // para não sugerir que abrem alguma coisa.
              const conteudo = (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-pixel text-[11px] text-text-muted">{entry.rank}</span>
                    {entry.rank === 1 ? <Trophy className="h-5 w-5 text-warning" /> : null}
                    <p className="text-sm font-medium">{entry.department}</p>
                    {abrivel && (
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-4 w-4 text-primary transition-transform duration-200",
                          turmaAberta && "rotate-180",
                        )}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && <Badge variant="primary">{t("mainPages.yourDepartment")}</Badge>}
                    <span className="font-pixel text-[11px]">{entry.xp} XP</span>
                  </div>
                </>
              );

              return (
                <li key={entry.department} className={cn(isCurrent && "bg-primary/5")}>
                  {abrivel ? (
                    <button
                      type="button"
                      onClick={() => setTurmaAberta((v) => !v)}
                      aria-expanded={turmaAberta}
                      aria-controls="lista-turma"
                      className="flex min-h-12 w-full items-center justify-between py-3 text-left transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
                    >
                      {conteudo}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between py-3">{conteudo}</div>
                  )}

                  <AnimatePresence initial={false}>
                    {abrivel && turmaAberta && turma && (
                      <motion.div
                        id="lista-turma"
                        initial={semMovimento ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={semMovimento ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mb-2 divide-y divide-border border-l-2 border-primary pl-3">
                          {turma.entries.map((aluno) => (
                            <li
                              key={`${aluno.rank}-${aluno.name}`}
                              className={cn(
                                "flex items-center justify-between py-2",
                                aluno.isYou && "bg-primary/5",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 text-center font-pixel text-[10px] text-text-muted">
                                  {aluno.rank}
                                </span>
                                {aluno.rank === 1 ? <Trophy className="h-4 w-4 text-warning" /> : null}
                                <p className="text-sm">{aluno.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {aluno.isYou && <Badge variant="primary">{t("mainPages.you")}</Badge>}
                                <span className="font-pixel text-[10px]">{aluno.xp} XP</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
