import { CiPhone, CiUser } from "react-icons/ci";
import type { AdminProps } from "../../../../lib/types/types";
import { ErrorMessage } from "../../../attoms/ErrorMessage";
import { LoadingSpinner } from "../../../attoms/LoadingSpinner";
import { IoIdCardOutline } from "react-icons/io5";
import { RiEdit2Fill, RiUserSettingsLine } from "react-icons/ri";
import { BiSolidUniversalAccess } from "react-icons/bi";
import { formatPhone } from "../../../../lib/utils/formatInfo";
import { Link } from "react-router";
import { DeleteConfirmationDialog } from "../../DeleteConfirmationDialong";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdmin } from "../../../../api/AdminApi";
import { toast } from "sonner";
import useAuth from "../../../../lib/hooks/useAuth";
import clsx from "clsx";

type Props = {
    data?: AdminProps[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

export const AdminTable = ({ data, isLoading, isError, error }: Props) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const deleteAdminMutation = useMutation({
        mutationFn: deleteAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin eliminado correctamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar usuario");
            console.error("Delete error.", error);
        },
    });

    const handleDelete = (adminId: string) => {
        deleteAdminMutation.mutate(adminId);
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

    const admins = data || [];

    console.log(admins);

    console.log(admins.filter((admin) => admin.id === auth?.id));
    return (
        <div className="bg-primary-200 rounded-md border-1 border-gray-600 shadow-lg shadow-gray-900 overflow-hidden ">
            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-md">Todos los administradores</h2>
                </div>
            </div>
            <div className="hidden md:block  w-full ">
                <table className="w-full relative ">
                    <thead className="border-b-1 space-x-2 border-gray-800">
                        <tr>
                            <th className="head-table"></th>
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
                                {" "}
                                <div className="flex gap-1 items-center">
                                    <BiSolidUniversalAccess className="text-lg" />
                                    <p>Acceso</p>
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
                        {admins.length === 0 && (
                            <tr>
                                <tr className="hover:bg-gray-800/50 items-center transition-colors ">
                                    <td
                                        className="table-item-base space-y-1 text-center gap-4 items-center"
                                        colSpan={7}
                                    >
                                        <p className="text-base text-gray-500">
                                            {" "}
                                            No existen administradores
                                            registrados
                                        </p>
                                    </td>
                                </tr>
                            </tr>
                        )}
                        {admins.map((admin, index) => (
                            <tr
                                key={index}
                                className={clsx("hover:bg-gray-800/50 items-center transition-colors ", admin.id === auth?.id && "bg-secondary-200/40 hover:bg-secondary-200/60")}
                            >
                                <td className="table-item-base">{index + 1}</td>
                                <td className="table-item-base space-y-1 flex gap-4 items-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 font-bold">
                                        {admin.name.charAt(0)}
                                        {admin.last_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {admin.name} {admin.last_name}
                                        </p>
                                        <p className="text-gray-300">
                                            {admin.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="table-item-base">
                                    {formatPhone(admin.phone)}
                                </td>
                                <td className="px-2">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                                            admin.confirmed
                                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                                        }`}
                                    >
                                        {admin.confirmed
                                            ? "Confirmada"
                                            : "Pendiente"}
                                    </span>
                                </td>
                                <td className="table-item-base">
                                    {admin.profile.access_level.toUpperCase()}
                                </td>
                                <td className="table-item-base">
                                    <div className="flex items-center gap-4 text-lg text-bold ">
                                        <Link
                                            to={`/dashboard/user/admin/${admin.id}/edit`}
                                            className="p-1 cursor-pointer text-yellow-400 border border-yellow-400 rounded-md"
                                        >
                                            <RiEdit2Fill />
                                        </Link>
                                        <DeleteConfirmationDialog
                                            fild={`Confirma eliminación de: ${admin.name} ${admin.last_name}`}
                                            onConfirm={() =>
                                                handleDelete(admin.id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
