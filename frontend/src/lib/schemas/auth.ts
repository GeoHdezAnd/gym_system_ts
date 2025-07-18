import z from "zod";
import { baseUserSchema } from "./users";

export const loginSchema = z.object({
    email: baseUserSchema.shape.email,
    password: z.string().min(1, "La contraseña no puede ir vacía"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = loginSchema.pick({ email: true });
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const passwordSchemaLogin = loginSchema.pick({ password: true });
export type PasswordFormLogin = Pick<LoginFormData, "password">;
