import z from "zod";

/// Esquema de PLAN
export const planSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre no puede estar vacío")
        .max(20, "El nombre no puede exceder los 20 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El nombre solo puede contener letras"
        ),
    description: z
        .string()
        .min(1, "La descripción no puede estar vacío")
        .max(50, "La descripción no puede exceder los 50 caracteres"),
    price: z
        .number()
        .min(150, "El precio de los planes no debe ser menor a 150")
        .max(1500, "El precio no puede exceder los 1500"),
    duration_days: z
        .number()
        .min(15, "La duración debe ser minimo 15 días")
        .max(365, "La duración no debe exceder los 365 días"),
    benefits: z.array(z.string().min(1, "No debe ser el beneficio vacio")),
    application_access: z.boolean(),
});

export type PlanFormData = z.infer<typeof planSchema>;