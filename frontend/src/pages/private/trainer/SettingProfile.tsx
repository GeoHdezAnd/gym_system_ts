import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router";
import useAuth from "../../../lib/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTrainerById, updateTrainer } from "../../../api/TrainerApi";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import {
    FormTrainer,
    type TrainerAddSchema,
} from "../../../components/organisms/admin";
import { toast } from "sonner";
import { handleApiError } from "../../../lib/utils/handleAPIError";

export default function SettingProfile() {
    const { auth } = useAuth();
    const id = auth?.id;
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getTrainerById(id!),
        queryKey: ["trainerId", id],
        enabled: !!id,
    });

    // Actualizar trainer
    const handleUpdateTrainer = async (trainer: TrainerAddSchema) => {
        await updateTrainer(id!, trainer);
    };

    // Mutation para actualizar miembro
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateTrainer,
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente");
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

    const defaultValues = data
        ? {
              name: data.name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              bio: data.profile.bio,
              skills: data.profile.skills,
          }
        : undefined;

    return (
        <main className="text-white max-w-md   grid text-center p-4 lg:p-1 space-y-3 overflow-auto">
            <Link className="hover:text-pink-800" to={"/trainer/profile"}>
                <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
            </Link>
            <FormTrainer
                description="Edita tu perfil"
                mode="edit"
                defaultValues={defaultValues}
                isLoading={mutationUpdate.isPending}
                onSubmit={async (data) => {
                    mutationUpdate.mutate(data);
                }}
            />
            <p className="text-xs text-gray-400">
                **La contraseña se edita desde la ruta de olvide contraseña
            </p>
            <Link
                to={"/forgot-password"}
                className="text-sm text-secondary-100"
            >
                Reiniciar contraseña
            </Link>
        </main>
    );
}
