import { z } from "zod";
import { UsernameSchema } from "../auth/dto";

export const CreateEmployeeDto = z.object({
  username: UsernameSchema,
  displayName: z.string().min(1),
  // Setor obrigatório: o ranking é por setor, então cadastrar sem setor deixa
  // a pessoa fora dele.
  department: z.string().min(1, "O setor é obrigatório."),
  // Senha inicial escolhida pelo admin. A pessoa é obrigada a trocar no
  // primeiro login (mustChangePassword), então isto é uma senha temporária.
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});
export type CreateEmployeeDto = z.infer<typeof CreateEmployeeDto>;
