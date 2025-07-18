import type { PlanProps } from "../../../lib/types/types";
import { formatMoney } from "../../../lib/utils/formatMoney";
import { ErrorMessage } from "../../attoms/ErrorMessage";
import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import {
    RiNewspaperLine,
    RiMoneyDollarCircleFill,
    RiSettings5Line,
    RiEdit2Fill,
} from "react-icons/ri";
import { MdDiscount } from "react-icons/md";
import { GiDuration } from "react-icons/gi";
import { IoFlash } from "react-icons/io5";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialong";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMembership } from "../../../api/MembershipApi";
import { toast } from "sonner";
import { handleApiError } from "../../../lib/utils/handleAPIError";
import { Link } from "react-router";
import { MobileMembershipCard } from "../../molecules/CardPlanMovil";

type Props = {
    data?: PlanProps[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

export const MembershipsTable = ({
    data,
    isLoading,
    isError,
    error,
}: Props) => {
    const queryClient = useQueryClient();

    const deleteMembershipMutation = useMutation({
        mutationFn: deleteMembership,
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["memberships"] });
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });

    const handleDeleteMembership = (id: string) => {
        deleteMembershipMutation.mutate(id);
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
                message="Error al cargar los planes"
                error={error!}
                className="my-4"
            />
        );
    }

    const memberships = data || [];
    return (
        <div className="bg-primary-200 rounded-md border-1 border-gray-800 shadow-lg shadow-gray-900 overflow-hidden select-none">
            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-md">Todos las membresias existentes</h2>
                </div>
            </div>

            {/*Tabla */}
            <div className="hidden md:block  w-full ">
                <table className="w-full relative">
                    <thead className="border-b-1 space-x-2 border-gray-800">
                        <tr>
                            <th className="head-table"> </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <IoFlash className="text-lg" />
                                    <p>Nombre</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <MdDiscount className="text-lg" />
                                    <p>Beneficios</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <RiNewspaperLine className="text-lg" />
                                    <p>Descripción</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <HiDevicePhoneMobile className="text-lg" />
                                    <p>Aplicación</p>
                                </div>
                            </th>

                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <RiMoneyDollarCircleFill className="text-lg" />
                                    <p>Precio</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <GiDuration className="text-lg" />
                                    <p>Duración</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <RiSettings5Line className="text-lg" />
                                    <p>Acciones</p>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700 text-xs items-center">
                        {memberships.length === 0 && (
                            <tr className="hover:bg-gray-800/50 items-center transition-colors ">
                                <td
                                    className="table-item-base space-y-1 text-center gap-4 items-center"
                                    colSpan={7}
                                >
                                    <p className="text-base text-gray-500">
                                        {" "}
                                        No existen membresias registradas
                                    </p>
                                </td>
                            </tr>
                        )}
                        {memberships.map((plan, index) => (
                            <tr
                                key={plan.id}
                                className="hover:bg-gray-800/50 items-center transition-colors "
                            >
                                <td className=" pl-4 flex-1 ">{index + 1}</td>
                                <td className="table-item-base">{plan.name}</td>
                                <td className="table-item-base">
                                    {plan.benefits.map((benefit, index) => (
                                        <p key={index}>{benefit}</p>
                                    ))}
                                </td>
                                <td className="table-item-base">
                                    {plan.description}
                                </td>
                                <td className="px-4 ">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                                            plan.application_access
                                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                                        }`}
                                    >
                                        {plan.application_access ? "SI" : "NO"}
                                    </span>
                                </td>
                                <td className="table-item-base">
                                    {formatMoney.format(plan.price)}
                                </td>
                                <td className="table-item-base">
                                    {plan.duration_days} días
                                </td>
                                <td className="table-item-base">
                                    <div className="flex items-center gap-4 text-lg text-bold ">
                                        <Link
                                            to={`/dashboard/membership/${plan.id}/edit`}
                                            className="p-1 cursor-pointer text-yellow-400 border border-yellow-400 rounded-md"
                                        >
                                            <RiEdit2Fill />
                                        </Link>
                                        <DeleteConfirmationDialog
                                            fild={`Confirmar eliminación de: ${plan.name}`}
                                            onConfirm={() =>
                                                handleDeleteMembership(plan.id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Versión móvil (cards) */}
            <div className="md:hidden p-4 space-y-4">
                {memberships.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay membresías registradas
                    </p>
                ) : (
                    memberships.map((plan) => (
                        <MobileMembershipCard
                            key={plan.id}
                            plan={plan}
                            handleDeleteMembership={handleDeleteMembership}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
