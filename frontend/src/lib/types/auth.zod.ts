import z from "zod";

// Comprobación del esquema de formularios de AUTH
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña no puede ir vacía"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = loginSchema.pick({ email: true });
export type ForgotPasswordForm = Pick<LoginFormData, "email">;

export const passwordSchema = loginSchema.pick({ password: true });
export type PasswordForm = Pick<LoginFormData, "password">;

// Tipos para el miembro
export const memberSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre no puede estar vacío")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El nombre solo puede contener letras"
        ),

    last_name: z
        .string()
        .min(1, "El apellido no puede estar vacío")
        .max(50, "El apellido no puede exceder los 50 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El apellido solo puede contener letras"
        ),

    email: z
        .string()
        .email("Email no válido")
        .max(100, "El email no puede exceder los 100 caracteres"),

    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(50, "La contraseña no puede exceder los 50 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
        .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
        .regex(/[0-9]/, "La contraseña debe contener al menos un número")
        .regex(
            /[^A-Za-z0-9]/,
            "La contraseña debe contener al menos un carácter especial"
        ),

    phone: z
        .string()
        .min(8, "El teléfono debe tener al menos 8 dígitos")
        .max(15, "El teléfono no puede exceder los 15 dígitos")
        .regex(/^[0-9]+$/, "El teléfono solo puede contener números"),

    gender: z.enum(["M", "F", "O"], {
        errorMap: () => ({ message: "El género debe ser M, F" }),
    }),

    born_date: z
        .string()

        .refine(
            (val) => {
                // Validar que la persona tenga al menos 13 años
                const [year, month, day] = val.split("-").map(Number);
                const birthDate = new Date(year, month - 1, day);
                const ageDiff = Date.now() - birthDate.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                return age >= 13;
            },
            {
                message: "Edad minima 13 años",
            }
        ),
});

export type MemberFormData = z.infer<typeof memberSchema>;
