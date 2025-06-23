import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../../../api/MemberApi";
import { type MemberProps } from "../../../lib/types/index.d";
import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import { ErrorMessage } from "../../attoms/ErrorMessage";

export const CustomerTable = () => {
    const { data, isLoading, isError, error } = useQuery<MemberProps[]>({
        queryFn: getMembers,
        queryKey: ["members"],
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
                message="Error al cargar los miembros"
                error={error}
                className="my-4"
            />
        );
    }
    console.log(data);

    const members = data || [];

    return (
        <div className="bg-primary-200 rounded-md border-1 border-gray-600 shadow-lg shadow-gray-900 overflow-hidden">
            {/* Encabezado */}
            <div className="flex justify-between items-center py-3 px-6">
                <h2 className="text-md font-medium">Todos los usuarios</h2>
                <p className="text-sm text-gray-300">
                    <span className="text-secondary-200">
                        1-{members.length}
                    </span>{" "}
                    de {members.length}
                </p>
            </div>
            <div className="w-auto h-[2px] bg-gray-700" />

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b-1 border-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Confirmado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Matrícula
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Nacimiento
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Género
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700 text-xs items-center">
                        {members.map((member) => (
                            <tr
                                key={member.id}
                                className="hover:bg-gray-800/50 transition-colors "
                            >
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="font-medium">
                                        {member.name} {member.lastName}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {member.phone}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {member.email}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            member.confirmed
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {member.confirmed
                                            ? "Confirmado"
                                            : "Pendiente"}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {member.profile?.matricula || "N/A"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {member.profile?.bornDate
                                        ? new Date(
                                              member.profile.bornDate
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {member.profile?.gender === "M"
                                        ? "Masculino"
                                        : member.profile?.gender === "F"
                                        ? "Femenino"
                                        : "Otro"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer con paginación */}
            <div className="px-6 py-3 bg-gray-800 text-right text-sm text-gray-300">
                1-{members.length} de {members.length}
            </div>
        </div>
    );
};
