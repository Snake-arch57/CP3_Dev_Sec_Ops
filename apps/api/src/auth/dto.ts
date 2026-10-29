import { z } from "zod";

export const UsernameSchema = z
  .string()
  .min(3, "O usuário deve ter pelo menos 3 caracteres.")
  .max(32, "O usuário deve ter no máximo 32 caracteres.")
  .regex(/^[a-z0-9._-]+$/i, "Use apenas letras, números, pontos, hífens ou underscores.");

export const LoginDto = z.object({
  username: UsernameSchema,
  password: z.string().min(1),
});
export type LoginDto = z.infer<typeof LoginDto>;

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres."),
});
export type ChangePasswordDto = z.infer<typeof ChangePasswordDto>;

export const BootstrapAdminDto = z.object({
  username: UsernameSchema,
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  displayName: z.string().min(1),
});
export type BootstrapAdminDto = z.infer<typeof BootstrapAdminDto>;
