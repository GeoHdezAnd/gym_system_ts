import { CiPhone, CiUser } from "react-icons/ci";
import type { TrainerProps } from "../../../../lib/types/types";
import { ErrorMessage } from "../../../attoms/ErrorMessage";
import { LoadingSpinner } from "../../../attoms/LoadingSpinner";
import { formatPhone } from "../../../../lib/utils/formatInfo";
import { IoIdCardOutline } from "react-icons/io5";
import { MdSportsGymnastics } from "react-icons/md";
import { RiEdit2Fill, RiUserSettingsLine } from "react-icons/ri";
import { DeleteConfirmationDialog } from "../../DeleteConfirmationDialong";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTrainer } from "../../../../api/TrainerApi";

type Props = {
    data?: TrainerProps[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

export const TrainerTable = ({ data, isLoading, isError, error }: Props) => {
    const queryClient = useQueryClient();

    const deleteTrainerMutation = useMutation({
        mutationFn: deleteTrainer,
        onSuccess: () => {
            // Invalidar la query para refrescar datos
            queryClient.invalidateQueries({ queryKey: ["trainers"] });
            toast.success("Usuario eliminado correctamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar usuario");
            console.error("Delete error.", error);
        },
    });

    // Manejar la eliminación
    const handleDelete = (userId: string) => {
        deleteTrainerMutation.mutate(userId);
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

    const trainers = data || [];

    console.log(trainers);

    return (
        <div className="bg-primary-200 rounded-md border-1 border-gray-800 shadow-lg shadow-gray-900 overflow-hidden ">
            <div className="flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-md">Todos los usuarios</h2>
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
                                <div className="flex gap-1 items-center">
                                    <MdSportsGymnastics className="text-lg" />
                                    <p>Habilidades</p>
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
                        {trainers.length === 0 && (
                            <tr className="hover:bg-gray-800/50 items-center transition-colors ">
                                <td
                                    className="table-item-base space-y-1 text-center gap-4 items-center"
                                    colSpan={7}
                                >
                                    <p className="text-base text-gray-500">
                                        {" "}
                                        No existen Entrenadores registrados
                                    </p>
                                </td>
                            </tr>
                        )}
                        {trainers.map((trainer, index) => (
                            <tr
                                key={trainer.id}
                                className="hover:bg-gray-800/50 items-center transition-colors "
                            >
                                <td className="table-item-base">{index + 1}</td>
                                <td className="table-item-base space-y-1 flex gap-4 items-center">
                                    <div>
                                        <p className="font-medium">
                                            {trainer.name} {trainer.last_name}
                                        </p>
                                        <p className="text-gray-300">
                                            {trainer.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="table-item-base">
                                    {formatPhone(trainer.phone)}
                                </td>
                                <td className="px-2">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                                            trainer.confirmed
                                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                                        }`}
                                    >
                                        {trainer.confirmed
                                            ? "Confirmada"
                                            : "Pendiente"}
                                    </span>
                                </td>
                                <td className="table-item-base">
                                    {trainer.profile.skills.map(
                                        (skill, index) => (
                                            <p key={index}>{skill}</p>
                                        )
                                    )}
                                </td>
                                <td className="table-item-base">
                                    <div className="flex items-center gap-4 text-lg text-bold ">
                                        <Link
                                            to={`/dashboard/user/trainer/${trainer.id}/edit`}
                                            className="p-1 cursor-pointer text-yellow-400 border border-yellow-400 rounded-md"
                                        >
                                            <RiEdit2Fill />
                                        </Link>
                                        <DeleteConfirmationDialog
                                            fild={`Confirma eliminación de: ${trainer.name} ${trainer.last_name}`}
                                            onConfirm={() =>
                                                handleDelete(trainer.id)
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
