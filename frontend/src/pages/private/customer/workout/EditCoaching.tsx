import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../lib/hooks/useAuth";
import {
    getRelationMemberTrainer,
    updateRelation,
} from "../../../../api/RelationMemberTrainerAPI";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../../components/attoms/ErrorMessage";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import type { TRelationMemberTrainer } from "../../../../lib/types/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { CustomInput } from "../../../../components/attoms/CustomInput";
import { Button } from "../../../../components/attoms/Button";
import { Modal } from "../../../../components/molecules/Modal";
import { GiMuscleUp } from "react-icons/gi";
import { SelectTrainer } from "../../../../components/organisms/clientTrainerApp";
import { toast } from "sonner";
import { handleApiError } from "../../../../lib/utils/handleAPIError";

export default function EditCoaching() {
    const { auth } = useAuth();
    const id = auth?.id;
    const {
        data: relationData,
        isLoading,
        isError,
        error,
    } = useQuery<TRelationMemberTrainer>({
        queryFn: () => getRelationMemberTrainer(id!),
        queryKey: ["relationMemberTrainer", id],
        enabled: !!id,
    });

    // Estado para controlar el modal de selección de entrenador
    const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<{
        id: string;
        name: string;
        last_name: string;
    } | null>(null);

    // Formulario para datos de coaching
    const { register, handleSubmit, control, reset, setValue } = useForm({
        defaultValues: {
            trainer_id: "",
            notes: relationData?.notes || "",
            goal: relationData?.goal || "",
            progress: {
                weight: relationData?.progress.weight,
            },
        },
    });

    // Actualizar formulario cuando cambien los datos
    useEffect(() => {
        if (relationData) {
            reset({
                ...relationData,
                goal: relationData.goal || "",
            });
            if (relationData.trainer_profile) {
                setSelectedTrainer({
                    id: relationData.trainer_profile.id,
                    name: relationData.trainer_profile.name,
                    last_name: relationData.trainer_profile.last_name,
                });
            }
        }
    }, [relationData, reset]);

    // Función para manejar la selección de entrenador
    const handleSelectTrainer = (trainer: {
        id: string;
        name: string;
        last_name: string;
    }) => {
        setSelectedTrainer(trainer);
    };

    const changeValueTrainer = () => {
        setValue("trainer_id", selectedTrainer!.id);
        setIsTrainerModalOpen(false);
    };

    // Actualizar en backend la relación
    const handleUpdateRelation = async (data: TRelationMemberTrainer) => {
        await updateRelation(data);
    };

    const queryClient = useQueryClient();

    // Mutación actualizar relación
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateRelation,
        onSuccess: () => {
            toast.success("Coaching actualizado");
            queryClient.invalidateQueries({
                queryKey: ["relationMemberTrainer", id],
            });
        },
        onError: (error: Error) => {
            toast.error(handleApiError(error));
            console.error(error);
        },
    });

    const handleFormSubmit: SubmitHandler<TRelationMemberTrainer> = async (
        formData: TRelationMemberTrainer
    ) => {
        try {
            if (formData.goal === "" || formData.progress.weight === 0) {
                toast.error("Llena los campos");
                return;
            }
            mutationUpdate.mutate(formData);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorMessage
                message="Error al cargar los datos"
                error={error}
                className="my-4"
            />
        );
    }
    console.log(selectedTrainer);
    return (
        <main className="text-white max-w-3xl mx-auto p-4 space-y-3">
            <Link
                className="hover:text-secondary-500 flex gap-2 items-center transition-colors"
                to="/user/training"
            >
                <IoIosArrowRoundBack className="text-2xl" />
                <span>Volver</span>
            </Link>

            <h2 className="text-lg font-bold text-center">Editar Coaching</h2>

            <form
                className="space-y-3"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                {/* Sección del Entrenador */}
                <div className="bg-primary-700 p-3 rounded-lg border border-gray-600 shadow-lg">
                    <h3 className="text-md font-semibold mb-4">
                        Entrenador asignado
                    </h3>

                    {selectedTrainer ? (
                        <div className="flex items-center gap-4  bg-primary-600 rounded-md">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white font-bold">
                                {selectedTrainer.name.charAt(0)}
                                {selectedTrainer.last_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">
                                    {selectedTrainer.name}{" "}
                                    {selectedTrainer.last_name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-400">
                            No hay entrenador asignado
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-4 w-full"
                        onClick={() => setIsTrainerModalOpen(true)}
                    >
                        <FiPlusCircle className="mr-2" />
                        {selectedTrainer
                            ? "Cambiar Entrenador"
                            : "Seleccionar Entrenador"}
                    </Button>

                    {/* Campo oculto para el ID del entrenador */}
                    <input type="hidden" {...register("trainer_id")} />
                </div>

                {/* Sección de Objetivos */}
                <div className="bg-primary-700 p-6 rounded-lg border border-gray-600 shadow-lg">
                    <div className="space-y-4">
                        <CustomInput
                            control={control}
                            name={`goal`}
                            label={`Objetivo:`}
                            type="text"
                        />
                    </div>
                </div>
                {/* Sección de progreso */}
                <div className="bg-primary-700 p-6 rounded-lg border border-gray-600 shadow-lg">
                    <h3>Progreso</h3>
                    <CustomInput
                        control={control}
                        name="progress.weight"
                        label="Peso en KG:"
                        type="number"
                        rows={4}
                    />
                </div>

                {/* Sección de Notas */}
                <div className="bg-primary-700 p-6 rounded-lg border border-gray-600 shadow-lg">
                    <CustomInput
                        control={control}
                        name="notes"
                        label="Notas adicionales:"
                        type="textarea"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="danger">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar Cambios
                    </Button>
                </div>
            </form>

            {/* Modal para selección de entrenador */}
            <Modal
                iconTitle={<GiMuscleUp />}
                isOpen={isTrainerModalOpen}
                onClose={() => setIsTrainerModalOpen(false)}
                title="Seleccionar Entrenador"
                description="Por favor selecciona entrenador"
            >
                <SelectTrainer
                    selectedTrainer={selectedTrainer!}
                    onSelectTrainer={handleSelectTrainer}
                />
                <Button onClick={changeValueTrainer} className="m-auto">
                    Asignar entrenador
                </Button>
            </Modal>
        </main>
    );
}
