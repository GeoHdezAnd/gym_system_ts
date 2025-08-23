import { useMutation, useQuery } from "@tanstack/react-query";
import { getMemberByID, updateMember } from "../../../api/MemberApi";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import useAuth from "../../../lib/hooks/useAuth";
import {
    FormMember,
    type MemberAddSchema,
} from "../../../components/organisms/admin";
import { Link } from "react-router";
import { toast } from "sonner";
import { handleApiError } from "../../../lib/utils/handleAPIError";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function SettingsClientProfile() {
    const { auth } = useAuth();
    const id = auth?.id;
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getMemberByID(id!),
        queryKey: ["userId", id],
        enabled: !!id,
    });
    // Actualizar miembro
    const handleUpdateMember = async (data: MemberAddSchema) => {
        await updateMember(id!, data);
    };

    // Mutation para actualizar miembro
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateMember,
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
              gender: data.profile.gender,
              born_date: data.profile.born_date,
          }
        : undefined;

    return (
        <main className="text-white grid text-center px-4 lg:p-1">
            <Link className="hover:text-pink-800" to={"/user/profile"}>
                <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
            </Link>
            <FormMember
                title="Preferencias"
                description="Edita los datos de tu perfil"
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
