import { useFieldArray, useForm } from "react-hook-form";
import { trainerSchema } from "../../../../lib/schemas/users";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CustomInput } from "../../../attoms";
import { RiUser3Fill } from "react-icons/ri";
import {
    MdEmail,
    MdPhoneInTalk,
    MdSportsGymnastics,
    MdArticle,
} from "react-icons/md";

import { useEffect, useState } from "react";

const trainerAddSchema = trainerSchema.omit({ password: true });
export type TrainerAddSchema = z.infer<typeof trainerAddSchema>;

type FormTrainerProps = {
    mode?: "create" | "edit";
    description: string;
    defaultValues?: Partial<TrainerAddSchema>; // Partial crea un type del objeto que recibe
    onSubmit?: (data: TrainerAddSchema) => Promise<void> | void;
    isLoading?: boolean;
};

export const FormTrainer = ({
    mode = "create",
    description,
    defaultValues,
    onSubmit,
    isLoading: externalLoading,
}: FormTrainerProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting: isFormSubmitting },
    } = useForm<TrainerAddSchema>({
        resolver: zodResolver(trainerAddSchema),
        defaultValues: {
            name: "",
            last_name: "",
            email: "",
            phone: "",
            bio: "",
            skills: [""],
            ...defaultValues,
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "skills",
        control,
    });
    useEffect(() => {
        if (fields.length === 0) {
            append("");
        }
    }, [fields.length, append]);
    const handleFormSubmit = async (formData: TrainerAddSchema) => {
        try {
            setIsSubmitting(true);
            if (onSubmit) {
                await onSubmit(formData);
                if (mode === "create") {
                    reset();
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    
    const isLoading = externalLoading || isFormSubmitting || isSubmitting;
    return (
        <div className="mb-8">
            <div className="mb-4 space-y-2">
                <h2 className="font-semibold text-lg ">Entrenador</h2>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <div className="space-y-6 bg-primary-200 rounded-md p-3 lg:p-6 shadow-lg shadow-gray-950 border-1 border-gray-800 w-full">
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(handleFormSubmit)}
                >
                    <CustomInput
                        name="name"
                        control={control}
                        label="Nombre(s)"
                        type="text"
                        error={errors.name}
                        placeholder="Carlos"
                        icon={<RiUser3Fill />}
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="last_name"
                        control={control}
                        label="Apellidos"
                        type="text"
                        error={errors.last_name}
                        icon={<RiUser3Fill />}
                        placeholder="Andrés Gómez"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="email"
                        control={control}
                        label="Correo"
                        type="email"
                        error={errors.email}
                        icon={<MdEmail />}
                        placeholder="correo@correo.com"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="phone"
                        control={control}
                        label="Télefono"
                        type="tel"
                        maxLength={10}
                        error={errors.phone}
                        icon={<MdPhoneInTalk />}
                        placeholder="2221234789"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="bio"
                        control={control}
                        label="Descripción breve"
                        type="textarea"
                        maxLength={200}
                        error={errors.bio}
                        icon={<MdArticle />}
                        placeholder="Presenta al entrenador en un parrafo corto"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    {/* Habilidades dinámicos */}
                    <div className="p-2  grid lg:flex lg:gap-4 items-center">
                        <div className="flex gap-4">
                            <label className="text-sm font-medium  flex items-center gap-2">
                                <MdSportsGymnastics />
                                Habilidades
                            </label>
                            <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                className="w-20 h-8"
                                disabled={fields.length === 3}
                                onClick={() => append("")}
                            >
                                + Agregar
                            </Button>
                        </div>
                        <div className="grid  gap-2 grid-cols-1 md:grid-cols-1 max-[]:lg:grid-cols-3">
                            {fields.map((field, idx) => (
                                <div
                                    key={field.id}
                                    className="flex  items-center justify-center gap-2"
                                >
                                    <CustomInput
                                        name={`skills.${idx}` as const}
                                        control={control}
                                        label=""
                                        type="text"
                                        placeholder={`Beneficio #${idx + 1}`}
                                        error={errors.skills?.[idx]}
                                    />
                                    <button
                                        type="button"
                                        className=" px-2 rounded bg-red-700 text-white text-xs hover:bg-red-800"
                                        onClick={() => remove(idx)}
                                        disabled={fields.length === 1}
                                        title="Eliminar beneficio"
                                    >
                                        –
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Enviar formulario
                    </Button>
                </form>
            </div>
        </div>
    );
};
