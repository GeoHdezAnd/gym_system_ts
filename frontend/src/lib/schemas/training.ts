import z from "zod";

export const workOutSchema = z
    .object({
        name: z
            .string()
            .min(1, "El nombre de la rutina es obligatorio")
            .max(50, "El nombre no puede tener más de 50 caracteres"),
        start_date: z
            .string()
            .min(1, "La fecha de inicio es obligatoria")
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Formato de fecha inválido. Use YYYY-MM-DD"
            ),
        end_date: z
            .string()
            .min(1, "La fecha de fin es obligatoria")
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Formato de fecha inválido. Use YYYY-MM-DD"
            ),
        exercises: z
            .array(
                z.object({
                    name: z
                        .string()
                        .min(1, "El nombre del ejercicio es obligatorio")
                        .max(
                            50,
                            "El nombre no puede tener más de 50 caracteres"
                        ),
                    sets: z
                        .union([z.string(), z.number()])
                        .transform((val) =>
                            typeof val === "string" ? parseInt(val) || 0 : val
                        )
                        .pipe(
                            z
                                .number()
                                .min(1, "Debe haber al menos 1 set")
                                .max(5, "No puede haber más de 5 sets")
                        ),
                    reps_goal: z
                        .union([z.string(), z.number()])
                        .transform((val) =>
                            typeof val === "string" ? parseInt(val) || 0 : val
                        )
                        .pipe(
                            z
                                .number()
                                .min(1, "Debe haber al menos 1 repetición")
                                .max(
                                    15,
                                    "No puede haber más de 15 repeticiones"
                                )
                        ),
                    notes: z
                        .string()
                        .max(
                            100,
                            "Las notas no pueden tener más de 100 caracteres"
                        )
                        .optional(),
                })
            )
            .min(1, "Debe agregar al menos un ejercicio")
            .max(12, "No puede haber más de 12 ejercicios"),
    })
    .refine(
        (data) => {
            // Validar que la fecha de fin sea posterior a la fecha de inicio
            if (data.start_date && data.end_date) {
                return new Date(data.end_date) >= new Date(data.start_date);
            }
            return true;
        },
        {
            message: "La fecha de fin debe ser posterior a la fecha de inicio",
            path: ["end_date"],
        }
    );

export type WorkOutData = z.infer<typeof workOutSchema>;
