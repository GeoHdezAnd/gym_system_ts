import { useQuery } from "@tanstack/react-query";
import { getMemberships } from "../../../api/MembershipApi";
import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import type { PlanProps } from "../../../lib/types/types";
import { formatMoney } from "../../../lib/utils/formatMoney";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Button } from "../../attoms";
import { useState } from "react";

interface SelectMembershipProps {
    onSelect: (membership: string) => void;
    showActionButton?: boolean;
}

export const SelectMembership = ({
    onSelect,
    showActionButton = true,
}: SelectMembershipProps) => {
    const [selectedMembership, setSelectedMembership] = useState<string>("");

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getMemberships(),
        queryKey: ["memberships"],
    });

    const handleSelect = (membership: PlanProps) => {
        setSelectedMembership(membership.id);
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
            <div className="text-center py-8">
                <p className="text-gray-300">Error al cargar las membresías</p>
                <Button
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Reintentar
                </Button>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-300">No hay membresías disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 ">
            <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 overflow-auto max-h-96`}
            >
                {data.map((membership: PlanProps) => (
                    <div
                        className={`bg-primary-200 border rounded-md p-4 transition-all cursor-pointer hover:shadow-lg
              ${
                  selectedMembership === membership.id
                      ? "border-purple-500 ring-2 ring-purple-500/30"
                      : "border-gray-600"
              }`}
                        key={membership.id}
                        onClick={() => handleSelect(membership)}
                    >
                        <div className="text-white">
                            <div className="flex gap-8 justify-between items-start">
                                <p className="font-semibold text-xl">
                                    {membership.name}
                                </p>
                                <div className="text-right">
                                    <p className="font-bold text-xl">
                                        {formatMoney.format(membership.price)}
                                    </p>
                                    <p className="font-light text-sm">
                                        / {membership.duration_days} días
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {membership.description}
                            </p>
                        </div>

                        <ul className="mt-2 space-y-2">
                            {membership.benefits.map((benefit, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <IoIosCheckmarkCircleOutline className="text-purple-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-white text-sm">
                                        {benefit}
                                    </p>
                                </li>
                            ))}
                            {membership.application_access && (
                                <li className="flex items-center gap-2 text-white text-sm">
                                    <IoIosCheckmarkCircleOutline className="text-base text-green-400 mt-0.5 flex-shrink-0" />
                                    Acceso a rutinas
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {showActionButton && selectedMembership && (
                <div className="flex justify-center ">
                    <Button onClick={() => onSelect(selectedMembership)}>
                        Seleccionar membresía
                    </Button>
                </div>
            )}
        </div>
    );
};
