import { z } from "zod";

export const AchievementCriteriaSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("perfect_emails_total"), count: z.number().int().positive() }),
  z.object({
    kind: z.literal("concept_mastered"),
    concept: z.string(),
    correctCount: z.number().int().positive(),
  }),
  z.object({ kind: z.literal("day_completed_no_errors"), dayId: z.string() }),
  z.object({ kind: z.literal("phases_completed"), count: z.number().int().positive() }),
]);
export type AchievementCriteria = z.infer<typeof AchievementCriteriaSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  criteria: AchievementCriteriaSchema,
  xpReward: z.number().int().nonnegative().default(0),
  moneyReward: z.number().int().nonnegative().default(0),
});
export type Achievement = z.infer<typeof AchievementSchema>;
