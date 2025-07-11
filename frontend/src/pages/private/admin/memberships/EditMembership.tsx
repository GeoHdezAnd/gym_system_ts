import { useMutation, useQuery } from "@tanstack/react-query";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router";
import {
    getMembershipId,
    updateMembership,
} from "../../../../api/MembershipApi";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { toast } from "sonner";
import { handleApiError } from "../../../../lib/utils/handleAPIError";
import type { PlanFormData } from "../../../../lib/types/schemas.zod";
import { FormPlan } from "../../../../components/organisms";

export function EditMembership() {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryFn: () => getMembershipId(id!),
        queryKey: ["memberId"],
    });

    const mutationUpdate = useMutation({
        mutationFn: (data: PlanFormData) => updateMembership(id!, data), // Suponiendo que `updateMembership` retorna una promesa
        onSuccess: (data) => {
            // `data` es la respuesta de tu API
            toast.success(data);
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) return <p className="m-auto text-gray-300">Id invalido</p>;

    const defaultValues = data
        ? {
              ...data,
          }
        : undefined;

    console.log(defaultValues);

    return (
        <div className="container text-white">
            <div className="flex gap-2 items-center mb-3">
                <Link
                    className="hover:text-pink-800"
                    to={"/dashboard/membership/all"}
                >
                    <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
                </Link>
                <h1 className="text-2xl font-semibold">Editar membresia</h1>
            </div>

            <div className=" px-2 py-2 shadow mx-0 lg:mx-12">
                <FormPlan
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
