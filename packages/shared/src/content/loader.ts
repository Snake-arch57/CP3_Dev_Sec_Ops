import { z } from "zod";
import { DaySchema, type Day } from "../schemas/phase.schema";
import { EmailSchema, type Email } from "../schemas/email.schema";
import { AchievementSchema, type Achievement } from "../schemas/achievement.schema";
import { UpgradeSchema, type Upgrade } from "../schemas/upgrade.schema";
import { ArcadeItemSchema, type ArcadeItem, QuizQuestionSchema, type QuizQuestion } from "../schemas/minigames.schema";

import achievementsRaw from "./achievements.json";
import achievementsEnRaw from "./achievements.en.json";
import upgradesRaw from "./upgrades.json";
import upgradesEnRaw from "./upgrades.en.json";
import day01Raw from "./days/day-01.json";
import day01EnRaw from "./days/day-01.en.json";
import day02Raw from "./days/day-02.json";
import day02EnRaw from "./days/day-02.en.json";
import day03Raw from "./days/day-03.json";
import day03EnRaw from "./days/day-03.en.json";
import day04Raw from "./days/day-04.json";
import day04EnRaw from "./days/day-04.en.json";
import day05Raw from "./days/day-05.json";
import day05EnRaw from "./days/day-05.en.json";
import day06Raw from "./days/day-06.json";
import day06EnRaw from "./days/day-06.en.json";
import arcadeItemsRaw from "./arcade-items.json";
import arcadeItemsEnRaw from "./arcade-items.en.json";
import quizQuestionsRaw from "./quiz-questions.json";
import quizQuestionsEnRaw from "./quiz-questions.en.json";

/**
 * "pt" é o idioma canônico do conteúdo (usado pelo backend, que nunca renderiza
 * texto — só compara ids/ground-truth, que são idênticos entre os idiomas).
 * "en" é uma tradução completa e paralela, mesmo ids/estrutura, só o texto muda.
 */
export type Locale = "pt" | "en";

export const DayFileSchema = DaySchema.omit({ emailIds: true }).extend({
  emails: z.array(EmailSchema).min(1),
});
export type DayFile = z.infer<typeof DayFileSchema>;

export interface LoadedDay {
  day: Day;
  emails: Email[];
}

export function parseDayFile(raw: unknown): LoadedDay {
  const parsed = DayFileSchema.parse(raw);
  const { emails, ...dayFields } = parsed;
  const day = DaySchema.parse({
    ...dayFields,
    emailIds: emails.map((email) => email.id),
  });
  return { day, emails };
}

/**
 * Registro estático dos arquivos de dia disponíveis, por idioma. Cada novo dia de
 * conteúdo (day-04.json, ...) é adicionado aqui como um import + entrada em AMBOS
 * os idiomas.
 */
const DAY_FILES_BY_LOCALE: Record<Locale, unknown[]> = {
  pt: [day01Raw, day02Raw, day03Raw, day04Raw, day05Raw, day06Raw],
  en: [day01EnRaw, day02EnRaw, day03EnRaw, day04EnRaw, day05EnRaw, day06EnRaw],
};

const ALL_DAYS_BY_LOCALE: Record<Locale, LoadedDay[]> = {
  pt: DAY_FILES_BY_LOCALE.pt.map(parseDayFile),
  en: DAY_FILES_BY_LOCALE.en.map(parseDayFile),
};

/** @deprecated use getAllDays()/getDayById()/getEmailsForDay() — kept for existing pt-only callers. */
export const ALL_DAYS: LoadedDay[] = ALL_DAYS_BY_LOCALE.pt;

export function getAllDays(locale: Locale = "pt"): Day[] {
  return ALL_DAYS_BY_LOCALE[locale].map((d) => d.day);
}

export function getDayById(dayId: string, locale: Locale = "pt"): LoadedDay | undefined {
  return ALL_DAYS_BY_LOCALE[locale].find((d) => d.day.id === dayId);
}

export function getEmailsForDay(dayId: string, locale: Locale = "pt"): Email[] {
  return getDayById(dayId, locale)?.emails ?? [];
}

const ACHIEVEMENTS_BY_LOCALE: Record<Locale, Achievement[]> = {
  pt: z.array(AchievementSchema).parse(achievementsRaw),
  en: z.array(AchievementSchema).parse(achievementsEnRaw),
};
export const ACHIEVEMENTS: Achievement[] = ACHIEVEMENTS_BY_LOCALE.pt;
export function getAchievements(locale: Locale = "pt"): Achievement[] {
  return ACHIEVEMENTS_BY_LOCALE[locale];
}

const UPGRADES_BY_LOCALE: Record<Locale, Upgrade[]> = {
  pt: z.array(UpgradeSchema).parse(upgradesRaw),
  en: z.array(UpgradeSchema).parse(upgradesEnRaw),
};
export const UPGRADES: Upgrade[] = UPGRADES_BY_LOCALE.pt;
export function getUpgrades(locale: Locale = "pt"): Upgrade[] {
  return UPGRADES_BY_LOCALE[locale];
}

const ARCADE_ITEMS_BY_LOCALE: Record<Locale, ArcadeItem[]> = {
  pt: z.array(ArcadeItemSchema).parse(arcadeItemsRaw),
  en: z.array(ArcadeItemSchema).parse(arcadeItemsEnRaw),
};
export const ARCADE_ITEMS: ArcadeItem[] = ARCADE_ITEMS_BY_LOCALE.pt;
export function getArcadeItems(locale: Locale = "pt"): ArcadeItem[] {
  return ARCADE_ITEMS_BY_LOCALE[locale];
}

const QUIZ_QUESTIONS_BY_LOCALE: Record<Locale, QuizQuestion[]> = {
  pt: z.array(QuizQuestionSchema).parse(quizQuestionsRaw),
  en: z.array(QuizQuestionSchema).parse(quizQuestionsEnRaw),
};
export const QUIZ_QUESTIONS: QuizQuestion[] = QUIZ_QUESTIONS_BY_LOCALE.pt;
export function getQuizQuestions(locale: Locale = "pt"): QuizQuestion[] {
  return QUIZ_QUESTIONS_BY_LOCALE[locale];
}
