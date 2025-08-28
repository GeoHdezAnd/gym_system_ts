import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router";
import {
    getAdminById,
    updateAdmin,
    type AdminRequest,
} from "../../../../api/AdminApi";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { FormAdmin } from "../../../../components/organisms/admin";
import { toast } from "sonner";
import { handleApiError } from "../../../../lib/utils/handleAPIError";

export default function AdminEdit() {
    const { adminId } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAdminById(adminId!),
        queryKey: ["adminId", adminId],
    });

    const queryClient = useQueryClient();

    // Actualizar administrador
    const handleUpdateAdmin = async (input: AdminRequest) => {
        await updateAdmin(input, adminId!);
    };

    // Mutación
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateAdmin,
        onSuccess: () => {
            toast.success("Entrenador actualizado correctamente");
            queryClient.invalidateQueries({
                queryKey: ["adminId", adminId],
            });
        },
        onError: (error: Error) => {
            toast.error(handleApiError(error));
            console.log(error);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError || !adminId || !data)
        return <p className="m-auto text-gray-300">Id invalido</p>;

    const defaultValues = data
        ? {
              name: data.name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              access_level: data.profile.access_level,
          }
        : undefined;

    return (
        <div className="container text-white">
            <div className="flex gap-2 items-center mb-3">
                <Link
                    className="hover:text-pink-800"
                    to={"/dashboard/user/admin/all"}
                >
                    <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
                </Link>
                <h1 className="text-2xl ">{`${defaultValues!.name} ${
                    defaultValues!.last_name
                }`}</h1>
            </div>
            <div className="w-full  px-2 py-2 shadow mx-0 ">
                <FormAdmin
                    description="Edita la información del admin"
                    mode="edit"
                    defaultValues={defaultValues}
                    isLoading={mutationUpdate.isPending}
                    onSubmit={async (data) => {
                        mutationUpdate.mutate(data);
                    }}
                />
            </div>
        </div>
    );
}
