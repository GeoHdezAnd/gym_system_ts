import { useMutation, useQuery } from "@tanstack/react-query";
import { IoCloseSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Link, useParams } from "react-router";
import {
    getWorkOutById,
    updateWorkOut,
} from "../../../api/RelationMemberTrainerAPI";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import { FormWorkOut } from "../../../components/organisms/clientTrainerApp/FormWorkOut";
import { Button } from "../../../components/attoms";
import { useState } from "react";
import { toast } from "sonner";
import { handleApiError } from "../../../lib/utils/handleAPIError";
import type { WorkOutData } from "../../../lib/schemas/training";

export default function EditWorkOut() {
    const { id, idWorkout } = useParams();
    const [disabledEdit, setDisabledEdit] = useState(true);

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getWorkOutById(idWorkout!),
        queryKey: ["workout", idWorkout],
        enabled: !!idWorkout,
    });

    const handleEditActive = () => {
        setDisabledEdit((prev) => !prev);
    };

    // Actualizar rutina
    const handleUpdateWorkOut = async (workout: WorkOutData) => {
        await updateWorkOut(data!.id, workout);
    };

    // Mutation para actualizar
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateWorkOut,
        onSuccess: () => {
            toast.success("Entrenamiento actualizado");
        },
        onError: (error: Error) => {
            toast.error(handleApiError(error));
            console.error(error);
        },
    });

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
                error={error!}
                className="my-4"
            />
        );
    }

    return (
        <main className="text-white max-w-md mx-auto grid p-4 lg:p-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
                <Link
                    className="hover:text-pink-800 flex items-center"
                    to={`/trainer/coaching/${id}`}
                >
                    <IoCloseSharp className="text-3xl cursor-pointer" />
                </Link>
                <h1 className="font-semibold text-xl flex-grow text-center">
                    Rutina
                </h1>
                <div className="w-8" />
            </div>

            <div className="space-y-4">
                <Button
                    size="md"
                    variant={disabledEdit ? "secondary" : "danger"}
                    onClick={handleEditActive}
                >
                    <MdEdit />
                    {disabledEdit ? "Activar edición" : "Cancelar edición"}
                </Button>
                <FormWorkOut
                    mode="edit"
                    defaultValues={data}
                    onSubmit={async (data) => {
                        mutationUpdate.mutate(data);
                    }}
                    isLoading={mutationUpdate.isPending}
                    disabled={disabledEdit}
                />
            </div>
        </main>
    );
}
