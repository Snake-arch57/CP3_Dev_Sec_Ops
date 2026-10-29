import { z } from "zod";

export const PurchaseUpgradeDto = z.object({
  upgradeId: z.string().min(1),
});
export type PurchaseUpgradeDto = z.infer<typeof PurchaseUpgradeDto>;
