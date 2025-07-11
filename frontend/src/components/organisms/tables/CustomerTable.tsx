import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import { ErrorMessage } from "../../attoms/ErrorMessage";
import { CiCalendarDate, CiPhone, CiUser } from "react-icons/ci";
import { IoIdCardOutline } from "react-icons/io5";
import { TiBusinessCard } from "react-icons/ti";
import type { MemberProps } from "../../../lib/types/types";
import { formatPhone, formatDate } from "../../../lib/utils/formatInfo";
import { RiEdit2Fill, RiUserSettingsLine } from "react-icons/ri";
import { CardMemberMovil } from "../../molecules/member/CardMemberMovil";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialong";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBatchMembers, deleteMember } from "../../../api/MemberApi";
import { useState } from "react";
import { PiEraserFill } from "react-icons/pi";
import { Button } from "../../attoms";
import { Link } from "react-router";

type Props = {
    data?: MemberProps[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

export const CustomerTable = ({ data, isLoading, isError, error }: Props) => {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const queryClient = useQueryClient();

    // Mutacion para eliminar miembro
    const deleteMemberMutation = useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            // Invalidar la query para refrescar datos
            queryClient.invalidateQueries({ queryKey: ["members"] });
            toast.success("Usuario eliminado correctamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar usuario");
            console.error("Delete error.", error);
        },
    });

    const deleteBatchMutation = useMutation({
        mutationFn: async (userIds: string[]) => {
            // Mostrar toast de carga
            const toastId = toast.loading(
                `Eliminando ${userIds.length} usuarios...`
            );

            try {
                const result = await deleteBatchMembers(userIds);

                // Actualizar toast a éxito
                toast.success(
                    `${userIds.length} usuarios eliminados correctamente`,
                    {
                        id: toastId,
                    }
                );

                return result;
            } catch (error) {
                // Actualizar toast a error
                toast.error("Error al eliminar usuarios", {
                    id: toastId,
                });
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            setSelectedMembers([]);
        },
        onError: (error) => {
            console.error("Batch delete error:", error);
        },
    });

    // Manejar seleccion y deseleccion de miembros
    const handleSelectMember = (userId: string, isChecked: boolean) => {
        setSelectedMembers((prev) =>
            isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
    };

    // Manejar selección y deselección de todos
    const handleSelectAll = (isChecked: boolean) => {
        setSelectedMembers(isChecked ? members.map((m) => m.user.id) : []);
    };

    // Manejar la eliminación
    const handleDelete = (userId: string) => {
        deleteMemberMutation.mutate(userId);
    };

    // Manejar eliminación por lotes
    const handleBatchDelete = () => {
        if (selectedMembers.length === 0) {
            toast.warning("No hay miembros seleccionados");
            return;
        }

        deleteBatchMutation.mutate(selectedMembers);
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
                message="Error al cargar los miembros"
                error={error!}
                className="my-4"
            />
        );
    }

    const members = data || [];

    return (
        <div className="bg-primary-200 rounded-md border-1 border-gray-800 shadow-lg shadow-gray-900 overflow-hidden ">
            {/* Encabezado con botón de eliminar seleccionados */}
            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-md">Todos los usuarios</h2>
                </div>
                {selectedMembers.length > 0 && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleBatchDelete}
                        disabled={deleteBatchMutation.isPending}
                    >
                        {deleteBatchMutation.isPending ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <PiEraserFill />
                        )}
                        Eliminar lote ({selectedMembers.length})
                    </Button>
                )}
            </div>

            {/* Tabla de usuarios */}
            <div className="hidden md:block  w-full ">
                <table className="w-full relative ">
                    <thead className="border-b-1 space-x-2 border-gray-800">
                        <tr>
                            <th className="head-table px-4">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedMembers.length ===
                                            members.length && members.length > 0
                                    }
                                    onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                    }
                                    className="m-auto"
                                />
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <CiUser className="text-xl" />
                                    <p>Nombre</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <CiPhone className="text-lg" />
                                    <p>Telefono</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <IoIdCardOutline className="text-lg" />
                                    <p>Cuenta</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <TiBusinessCard className="text-lg" />
                                    <p>Matricula</p>
                                </div>
                            </th>
                            <th className="head-table">
                                <div className="flex gap-1 items-center">
                                    <CiCalendarDate className="text-lg" />
                                    <p>Nacimiento</p>
                                </div>
                            </th>
                            <th className="head-table">
                                {" "}
                                <div className="flex gap-1 items-center">
                                    <RiUserSettingsLine className="text-lg" />
                                    <p>Opciones</p>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className=" divide-y divide-gray-700 text-xs items-center">
                        {members.length === 0 && (
                            <tr className="hover:bg-gray-800/50 items-center transition-colors ">
                                <td
                                    className="table-item-base space-y-1 text-center gap-4 items-center"
                                    colSpan={7}
                                >
                                    <p className="text-base text-gray-500">
                                        {" "}
                                        No existen miembros registrados
                                    </p>
                                </td>
                            </tr>
                        )}
                        {members.map(({ user, profile }) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-800/50 items-center transition-colors "
                            >
                                <td className=" pl-4 flex-1 ">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(
                                            user.id
                                        )}
                                        onChange={(e) =>
                                            handleSelectMember(
                                                user.id,
                                                e.target.checked
                                            )
                                        }
                                        className="m-auto"
                                    />
                                </td>
                                <td className="table-item-base space-y-1 flex gap-4 items-center">
                                    <div className="rounded-full ring-2 ring-secondary-200 shadow-2xs shadow-purple-950 ">
                                        <img
                                            className="rounded-full"
                                            src={`${
                                                profile.gender === "M"
                                                    ? "/male-avatar.png"
                                                    : "/female-avatar.png"
                                            }`}
                                            width={30}
                                            alt="customer-photo"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {user.name} {user.last_name}
                                        </p>
                                        <p className="text-gray-300">
                                            {user.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="table-item-base">
                                    {formatPhone(user.phone)}
                                </td>

                                <td className="px-2">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                                            user.confirmed
                                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                                        }`}
                                    >
                                        {user.confirmed
                                            ? "Confirmada"
                                            : "Pendiente"}
                                    </span>
                                </td>
                                <td className="table-item-base">
                                    {profile.matricula || "N/A"}
                                </td>
                                <td className="table-item-base ">
                                    {profile.born_date
                                        ? formatDate(profile.born_date)
                                        : "N/A"}
                                </td>
                                <td className="table-item-base">
                                    <div className="flex items-center gap-4 text-lg text-bold ">
                                        <Link
                                            to={`/dashboard/user/customer/${user.id}/edit`}
                                            className="p-1 cursor-pointer text-yellow-400 border border-yellow-400 rounded-md"
                                        >
                                            <RiEdit2Fill />
                                        </Link>
                                        <DeleteConfirmationDialog
                                            fild={`Confirma eliminación de: ${user.name} ${user.last_name}`}
                                            onConfirm={() =>
                                                handleDelete(user.id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Versión móvil: cards para que sea mejor visualmente */}
            <div className="md:hidden space-y-2 p-2">
                {members.map((member, index) => (
                    <CardMemberMovil
                        {...member}
                        key={index}
                        onDelete={handleDelete}
                        isSelected={selectedMembers.includes(member.user.id)}
                        onSelect={handleSelectMember}
                    />
                ))}
            </div>
        </div>
    );
};
