import { z } from "zod";
import { InvestigationToolIdSchema } from "./email.schema";

/**
 * Upgrades só reduzem custo/tempo ou realçam pistas — nunca resolvem
 * o email automaticamente. Isso preserva a mecânica central de investigação.
 */
export const UpgradeEffectSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("reduce_tool_cost"),
    toolId: InvestigationToolIdSchema,
    reduceSeconds: z.number().positive(),
  }),
  z.object({ kind: z.literal("highlight_suspicious_links") }),
  z.object({ kind: z.literal("highlight_suspicious_domains") }),
  z.object({ kind: z.literal("extra_time_per_email"), seconds: z.number().positive() }),
]);
export type UpgradeEffect = z.infer<typeof UpgradeEffectSchema>;

export const UpgradeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  priceMoney: z.number().int().nonnegative(),
  effect: UpgradeEffectSchema,
});
export type Upgrade = z.infer<typeof UpgradeSchema>;
