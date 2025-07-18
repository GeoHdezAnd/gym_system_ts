import { z } from "zod";

// Esquema base reutilizable de usuario
export const baseUserSchema = z.object({
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

    phone: z
        .string()
        .min(10, "El teléfono debe tener al menos 10 dígitos")
        .max(10, "El número debe tener maximo 10 dígitos")
        .regex(/^[0-9]+$/, "El teléfono solo puede contener números"),
});

export const passwordSchema = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder los 50 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(
        /[^A-Za-z0-9]/,
        "La contraseña debe contener al menos un carácter especial"
    );

export const memberSchema = baseUserSchema.extend({
    password: passwordSchema,
    gender: z.enum(["M", "F", "O"], {
        errorMap: () => ({ message: "El género debe ser M o F" }),
    }),
    born_date: z.string().refine(
        (val) => {
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

// Ejemplo de esquema para administrador que comparte campos con member
export const adminSchema = baseUserSchema.extend({
    access_level: z.enum(["full", "limited"]),
});

export type AdminFormData = z.infer<typeof adminSchema>;

// Ejemplo de esquema para entrenador
export const trainerSchema = baseUserSchema.extend({
    password: passwordSchema.optional(), // Opcional para actualizaciones
    specialization: z.string().min(1, "Especialización requerida"),
    certification: z.string().min(1, "Certificación requerida"),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;
