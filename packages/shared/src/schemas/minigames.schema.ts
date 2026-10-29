import { z } from "zod";
import { SecurityConceptTagSchema } from "./email.schema";

export const ArcadeItemSchema = z.object({
  id: z.string(),
  sender: z.string(),
  subject: z.string(),
  isPhishing: z.boolean(),
  concept: SecurityConceptTagSchema,
  explanation: z.string(),
});
export type ArcadeItem = z.infer<typeof ArcadeItemSchema>;

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  concept: SecurityConceptTagSchema,
  difficulty: z.number().int().min(1).max(9),
  explanation: z.string(),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
