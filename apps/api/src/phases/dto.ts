import { z } from "zod";

export const SavePhaseResultDto = z.object({
  dayId: z.string().min(1),
  correctCount: z.number().int().nonnegative(),
  wrongCount: z.number().int().nonnegative(),
  totalScore: z.number().int(),
  xpEarned: z.number().int().nonnegative(),
  moneyEarned: z.number().int().nonnegative(),
  timeUsedSeconds: z.number().int().nonnegative(),
  bestCombo: z.number().int().nonnegative(),
  conceptCorrectCounts: z.record(z.string(), z.number().int().nonnegative()).default({}),
});
export type SavePhaseResultDto = z.infer<typeof SavePhaseResultDto>;
