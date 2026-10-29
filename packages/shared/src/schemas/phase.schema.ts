import { z } from "zod";

export const EventTypeSchema = z.enum([
  "boss_call",
  "message_burst",
  "black_friday",
  "slow_internet",
  "system_crash",
]);
export type EventType = z.infer<typeof EventTypeSchema>;

export const GameEventEffectSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("timer_penalty"), seconds: z.number() }),
  z.object({ kind: z.literal("spawn_extra_emails"), emailIds: z.array(z.string()) }),
  z.object({
    kind: z.literal("ui_distraction"),
    variant: z.enum(["boss_popup", "flood_banner", "lag_glitch"]),
  }),
]);
export type GameEventEffect = z.infer<typeof GameEventEffectSchema>;

export const GameEventSchema = z.object({
  id: z.string(),
  type: EventTypeSchema,
  triggerAfterEmailIndex: z.number().int().nonnegative(),
  durationSeconds: z.number().int().positive(),
  message: z.string(),
  effect: GameEventEffectSchema,
});
export type GameEvent = z.infer<typeof GameEventSchema>;

export const DaySchema = z.object({
  id: z.string(),
  dayNumber: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  difficultyRange: z.tuple([z.number(), z.number()]),
  timeLimitSeconds: z.number().int().positive(),
  emailIds: z.array(z.string()).min(1),
  events: z.array(GameEventSchema).default([]),
  isBossDay: z.boolean().default(false),
  requirements: z
    .object({
      minLevel: z.number().optional(),
      minReputation: z.number().optional(),
    })
    .optional(),
});
export type Day = z.infer<typeof DaySchema>;
