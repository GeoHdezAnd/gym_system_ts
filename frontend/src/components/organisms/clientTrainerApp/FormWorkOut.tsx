import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Button, CustomInput } from "../../attoms";
import { MdAdd, MdDelete, MdExpandLess, MdExpandMore } from "react-icons/md";
import { workOutSchema, type WorkOutData } from "../../../lib/schemas/training";
import { FaDumbbell } from "react-icons/fa6";

type WorkOutFormProps = {
    mode?: "create" | "edit";
    defaultValues?: Partial<WorkOutData>;
    disabled?: boolean;
    onSubmit?: (data: WorkOutData) => Promise<void> | void;
    isLoading?: boolean;
};

export const FormWorkOut = ({
    mode = "create",
    disabled,
    defaultValues,
    onSubmit,
    isLoading: externalLoading,
}: WorkOutFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [expandedExercises, setExpandedExercises] = useState<Set<number>>(
        new Set()
    );

    const getDate = (monthPlus?: number) => {
        const today = new Date();

        if (monthPlus) {
            // Si se proporciona el parámetro weeks, aumentar meses en lugar de semanas
            today.setMonth(today.getMonth() + monthPlus);
        }

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(workOutSchema),
        defaultValues: {
            name: "",
            start_date: getDate(),
            end_date: "",
            exercises: [
                {
                    name: "",
                    sets: "",
                    reps_goal: "",
                    notes: "",
                },
            ],
            ...defaultValues,
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises",
    });

    // Observar los valores de los ejercicios para mostrar en modo contraído
    const exercisesValues = watch("exercises");

    const addExercise = () => {
        const newIndex = fields.length;
        append({
            name: "",
            sets: "",
            reps_goal: "",
            notes: "",
        });
        // Expandir automáticamente el nuevo ejercicio
        setExpandedExercises((prev) => new Set(prev).add(newIndex));
    };

    const toggleExercise = (index: number) => {
        setExpandedExercises((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleFormSubmit: SubmitHandler<WorkOutData> = async (
        data: WorkOutData
    ) => {
        console.log(data);
        try {
            setIsSubmitting(true);
            if (onSubmit) {
                await onSubmit(data);
                if (mode === "create") {
                    reset();
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isSubmitting || externalLoading;

    return (
        <main className="text-white max-w-md mx-auto grid  overflow-auto">
            <div>
                <form
                    className="space-y-3"
                    onSubmit={handleSubmit(handleFormSubmit)}
                >
                    <CustomInput
                        name="name"
                        placeholder="Nombre de la rutina"
                        error={errors.name}
                        control={control}
                        disabled={disabled}
                    />

                    <div className="flex justify-between">
                        <div>
                            <p className="text-gray-300 p-1">Fecha inicio: </p>
                            <CustomInput
                                name="start_date"
                                type="date"
                                min={
                                    mode !== "edit"
                                        ? getDate()
                                        : defaultValues?.start_date
                                }
                                error={errors.start_date}
                                control={control}
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <p className="text-gray-300 p-1">Fecha fin: </p>
                            <CustomInput
                                name="end_date"
                                type="date"
                                min={
                                    mode !== "edit"
                                        ? getDate(1)
                                        : defaultValues?.end_date
                                } // SI agregas 1 deja seleccionar un mes despues la fecha de end
                                error={errors.end_date}
                                control={control}
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Ejercicios</h2>
                        {!disabled && (
                            <Button type="button" onClick={addExercise}>
                                <MdAdd className="text-xl" />
                                <p>Agregar ejercicio</p>
                            </Button>
                        )}
                    </div>

                    {fields.map((field, index) => {
                        const isExpanded = expandedExercises.has(index);
                        const exerciseData = exercisesValues[index];

                        return (
                            <div
                                key={field.id}
                                className="border border-gray-700 p-4 rounded-lg mb-4"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <FaDumbbell className="text-xl text-gray-400" />
                                        <span className="font-medium">
                                            Ejercicio {index + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!disabled && (
                                            <button
                                                type="button"
                                                disabled={disabled}
                                                onClick={() =>
                                                    toggleExercise(index)
                                                }
                                                className="text-gray-400 hover:text-white p-1"
                                                title={
                                                    isExpanded
                                                        ? "Contraer"
                                                        : "Expandir"
                                                }
                                            >
                                                {isExpanded ? (
                                                    <MdExpandLess className="text-xl" />
                                                ) : (
                                                    <MdExpandMore className="text-xl" />
                                                )}
                                            </button>
                                        )}

                                        {(fields.length > 1 && !disabled )&& (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Eliminar ejercicio"
                                            >
                                                <MdDelete className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Vista contraída - solo muestra la información */}
                                {(!isExpanded || disabled) && exerciseData && (
                                    <div className="bg-gray-800/60 p-3 rounded-md mb-3">
                                        <p className="font-medium truncate">
                                            {exerciseData.name || "Sin nombre"}
                                        </p>
                                        <div className="flex gap-4 text-sm text-gray-300 mt-2">
                                            <span>
                                                Sets: {exerciseData.sets || "0"}
                                            </span>
                                            <span>
                                                Reps:{" "}
                                                {exerciseData.reps_goal || "0"}
                                            </span>
                                        </div>
                                        {exerciseData.notes && (
                                            <p className="text-sm text-gray-400 mt-2 truncate">
                                                Notas: {exerciseData.notes}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Vista expandida - muestra todos los inputs */}
                                {isExpanded && !disabled && (
                                    <>
                                        <div className="flex gap-2 items-center w-auto mb-3">
                                            <div className="flex-1">
                                                <CustomInput
                                                    name={`exercises.${index}.name`}
                                                    placeholder="Nombre ejercicio"
                                                    error={
                                                        errors.exercises?.[
                                                            index
                                                        ]?.name
                                                    }
                                                    control={control}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mb-3">
                                            <CustomInput
                                                name={`exercises.${index}.sets`}
                                                error={
                                                    errors.exercises?.[index]
                                                        ?.sets
                                                }
                                                maxLength={1}
                                                placeholder="Sets (3-4)"
                                                control={control}
                                            />
                                            <CustomInput
                                                name={`exercises.${index}.reps_goal`}
                                                error={
                                                    errors.exercises?.[index]
                                                        ?.reps_goal
                                                }
                                                maxLength={2}
                                                placeholder="Reps"
                                                control={control}
                                            />
                                        </div>

                                        <CustomInput
                                            name={`exercises.${index}.notes`}
                                            error={
                                                errors.exercises?.[index]?.notes
                                            }
                                            placeholder="Notas"
                                            type="textarea"
                                            rows={2}
                                            control={control}
                                        />
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <div className="mt-6">
                        {!disabled && (
                            <Button
                                loading={isLoading}
                                disabled={isLoading || disabled}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Guardar Rutina
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
};
