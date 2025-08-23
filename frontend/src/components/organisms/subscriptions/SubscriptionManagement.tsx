import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getSubscriptionsByUserId,
    makeSubscriptionMember,
} from "../../../api/SubscriptionApi";
import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import { Button } from "../../attoms";
import { CiShop } from "react-icons/ci";
import { useState } from "react";
import { Modal } from "../../molecules/Modal";
import { SelectMembership } from "./SelectMembership";
import { toast } from "sonner";
import { handleApiError } from "../../../lib/utils/handleAPIError";
import type { SubsciptionMemberInfo } from "../../../lib/types/types";
import { formatMoney } from "../../../lib/utils/formatMoney";
import { formatDate } from "../../../lib/utils/formatInfo";
import { GrStatusGoodSmall } from "react-icons/gr";
import clsx from "clsx";

export const SubscriptionManagement = ({ userId }: { userId: string }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryFn: () => getSubscriptionsByUserId(userId),
        queryKey: ["subscriptionsMemberId", userId],
    });

    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<string | null>(
        null
    );

    const makeSubscriptionMutation = useMutation({
        mutationFn: ({ userId, planId }: { userId: string; planId: string }) =>
            makeSubscriptionMember(userId, planId),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({
                queryKey: ["subscriptionsMemberId", userId],
            });
            setIsModalOpen(false);
            setSelectedMembership(null);
            refetch();
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });

    const handleMembershipSelect = (membershipId: string) => {
        if (membershipId && userId) {
            makeSubscriptionMutation.mutate({
                userId,
                planId: membershipId,
            });
        }
    };

    const handleConfirmSubscription = () => {
        if (!selectedMembership || !userId) {
            toast.error("Selecciona una membresía primero");
            return;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !userId) {
        return <p className="m-auto text-gray-300">Id invalido</p>;
    }

    return (
        <div className="mb-8">
            <div className="mb-4 space-y-2">
                <h2 className="font-semibold text-lg">Suscripciones</h2>
                <p className="text-sm text-gray-400">
                    Registro de suscripciones adquiridas
                </p>
            </div>

            {data.length === 0 ? (
                <div className="grid text-center gap-2">
                    <p className="">
                        El usuario no tiene ninguna suscripción adquirida,
                        presiona en el botón para otorgarle una
                    </p>
                    <Button
                        className="m-auto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <CiShop className="text-lg" />
                        Abrir panel de venta
                    </Button>
                </div>
            ) : (
                <div className="h-92">
                    {/* Aquí puedes mostrar la lista de suscripciones existentes si es necesario */}
                    <Button
                        className="mt-4"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <CiShop className="text-lg" />
                        Agregar nueva suscripción
                    </Button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {data.map((subscription: SubsciptionMemberInfo) => (
                            <article
                                key={subscription.id}
                                className="bg-primary-200 shadow-sm shadow-gray-700 border border-gray-500 rounded-2xl p-4 transition-transform hover:scale-[1.01] hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-primary-600">
                                        {subscription.plan.name}
                                    </h3>
                                    <span
                                        className={clsx(
                                            "  text-xs font-bold px-2 py-1 rounded-md",
                                            subscription.status === "active" &&
                                                "bg-green-500/25 border-green-700 border shadow-sm shadow-green-700 text-green-400",
                                            subscription.status === "expired" &&
                                                "bg-red-500/20 border-red-700 border shadow-sm shadow-red-700 text-red-600"
                                        )}
                                    >
                                        {subscription.status === "active"
                                            ? "Activa"
                                            : "Expiro"}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-100 text-sm ">
                                        Precio:{" "}
                                        <span className="text-gray-400 ">
                                            {formatMoney.format(
                                                subscription.plan.price
                                            )}
                                        </span>
                                    </p>
                                    <p className="text-gray-100 text-sm ">
                                        Días de duración:{" "}
                                        <span className="text-gray-400 ">
                                            {subscription.plan.duration_days}
                                        </span>
                                    </p>
                                    <p className="text-gray-200 text-sm">
                                        Fecha de inicio:{" "}
                                        <span className=" text-gray-400">
                                            {formatDate(
                                                subscription.start_date
                                            ) ?? "—"}
                                        </span>
                                    </p>
                                    <p className="text-gray-200 text-sm">
                                        Fecha fin:{" "}
                                        <span className="text-gray-400 ">
                                            {formatDate(
                                                subscription.end_date
                                            ) ?? "—"}
                                        </span>
                                    </p>
                                    <p className="text-gray-200 text-sm flex items-center">
                                        Acceso a gestión de rutinas:
                                        <span
                                            className={clsx(
                                                ` pl-4`,
                                                subscription.plan
                                                    .application_access
                                                    ? "text-green-500 "
                                                    : "text-red-600"
                                            )}
                                        >
                                            <GrStatusGoodSmall className="text-lg " />
                                        </span>
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMembership(null);
                }}
                title="Compra de membresía"
                description="Elige la membresía que desea adquirir el cliente"
                iconTitle={<CiShop className="text-2xl" />}
            >
                <div className="space-y-4">
                    <SelectMembership
                        onSelect={handleMembershipSelect}
                        showActionButton={true}
                    />

                    {selectedMembership && (
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmSubscription}>
                                Confirmar Suscripción
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
