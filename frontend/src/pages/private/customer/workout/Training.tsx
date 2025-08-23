import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../lib/hooks/useAuth";
import { getSubscriptionsByUserId } from "../../../../api/SubscriptionApi";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../../components/attoms/ErrorMessage";
import type {
    SubsciptionMemberInfo,
    TRelationMemberTrainer,
} from "../../../../lib/types/types";
import { FaHeartBroken } from "react-icons/fa";
import { GiMuscleUp, GiStairsGoal } from "react-icons/gi";
import {
    createRelationMemberTrainer,
    getRelationMemberTrainer,
} from "../../../../api/RelationMemberTrainerAPI";
import { Modal } from "../../../../components/molecules/Modal";
import { SelectTrainer } from "../../../../components/organisms/clientTrainerApp";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/attoms";
import { toast } from "sonner";
import { handleApiError } from "../../../../lib/utils/handleAPIError";
import { formatPhone } from "../../../../lib/utils/formatInfo";
import { Link } from "react-router";
import { FiEdit2 } from "react-icons/fi";

export default function Training() {
    const { auth } = useAuth();
    const id = auth?.id;
    const [activeModal, setActiveModal] = useState<boolean>(false);
    const [selectedTrainer, setSelectedTrainer] = useState<{
        id: string;
        name: string;
        last_name: string;
    } | null>(null);

    /// Use Query para verificar si tiene suscripciónes
    const {
        data: subscriptionsData,
        isLoading: subscriptionsLoading,
        isError: subscriptionIsError,
        error: subscriptionError,
    } = useQuery({
        queryFn: () => getSubscriptionsByUserId(id!),
        queryKey: ["subscriptionsUserId", id],
        enabled: !!id,
    });

    // Use Query para obtener la relación cliente entrenador
    const {
        data: dataRelation,
        isLoading: isLoadingRelation,
        isError: isErrorRelation,
        error: errorRelation,
    } = useQuery<TRelationMemberTrainer>({
        queryFn: () => getRelationMemberTrainer(id!),
        queryKey: ["relationMemberTrainer", id],
        enabled: !!id,
    });

    const queryClient = useQueryClient();

    // Mutation para asignar entrenador a la relación con cliente
    const createRelationMutation = useMutation({
        mutationFn: (input: { memberId: string; trainerId: string }) =>
            createRelationMemberTrainer(input),

        onSuccess: () => {
            toast.success("Entrenador seleccionado");
            queryClient.invalidateQueries({
                queryKey: ["relationMemberTrainer"],
            });
        },
        onError: (error) => {
            toast.success(handleApiError(error));
        },
    });

    // Handle para creación de la relacion entre cliente y entrenador
    const handleCreateRelation = () => {
        createRelationMutation.mutate({
            memberId: id!,
            trainerId: selectedTrainer!.id!,
        });
    };

    const handleModal = () => {
        setActiveModal((prev) => !prev);
    };

    const handleSelectedTrainer = (trainer: {
        id: string;
        name: string;
        last_name: string;
    }) => {
        setSelectedTrainer(trainer);
    };

    useEffect(() => {
        const checkRelation = () => {
            if (dataRelation === null) {
                setActiveModal(true);
            }
        };
        checkRelation();
    }, [dataRelation]);

    if (subscriptionsLoading || isLoadingRelation) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (subscriptionIsError || isErrorRelation) {
        return (
            <ErrorMessage
                message="Error al cargar los datos"
                error={subscriptionError! || errorRelation!}
                className="my-4"
            />
        );
    }

    // Obtener dato si tiene permisos de esta sección
    const lastSubscription: SubsciptionMemberInfo =
        subscriptionsData[0] || null;

    if (!lastSubscription) {
        return (
            <div className="text-white h-full flex flex-col text-center p-4 lg:p-1 space-y-3 overflow-auto">
                <h1 className="m-auto">
                    No tienes acceso a esta parte de la aplicación hasta que
                    adquieras una suscripción valida
                </h1>
            </div>
        );
    }
    const accessAplication = lastSubscription.plan.application_access || false;

    return (
        <main className="text-white h-full flex flex-col text-center p-4 lg:p-1 space-y-3 overflow-auto">
            <h1 className="font-semibold text-2xl lg:text-xl">
                Entrenamientos
            </h1>

            {!accessAplication && (
                <div className="flex-1 grid">
                    <div className="m-auto">
                        <FaHeartBroken className="m-auto text-5xl text-red-700 drop-shadow-lg drop-shadow-red-600 mb-6" />
                        <p className="text-gray-400 max-w-60">
                            No tienes acceso a esta parte de la aplicación,
                            adquiere en recepción una membresia que tenga
                            incluido la gestión de rutinas para seguir
                            disfrutando este beneficio
                        </p>
                    </div>
                </div>
            )}

            {!dataRelation && (
                <div className="max-w-96">
                    <Modal
                        iconTitle={<GiMuscleUp />}
                        isOpen={activeModal}
                        onClose={handleModal}
                        title="Creación de relación"
                        description="Por favor selecciona entrenador"
                    >
                        <SelectTrainer
                            selectedTrainer={selectedTrainer!}
                            onSelectTrainer={handleSelectedTrainer}
                        />
                        <Button
                            onClick={handleCreateRelation}
                            disabled={!selectedTrainer?.id || !id}
                            className="m-auto"
                        >
                            Asignar entrenador
                        </Button>
                    </Modal>
                </div>
            )}

            {dataRelation && (
                <div className="bg-primary-300 border border-gray-500 rounded-md shadow shadow-gray-600 px-3 py-2 text-left relative">
                    <Link
                        to="coaching"
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
                        title="Editar información"
                    >
                        <FiEdit2 className="text-gray-300 text-2xl hover:text-white" />
                    </Link>

                    <h2 className="text-center font-semibold p-1 mb-1">
                        Información general
                    </h2>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 font-bold border-2 border-secondary-200 shadow shadow-gray-600">
                            {dataRelation.trainer_profile?.name.charAt(0)}
                            {dataRelation.trainer_profile?.last_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-gray-300 text-xs grid">
                                Entrenador:{" "}
                                <span className="text-white text-base">
                                    {`${dataRelation.trainer_profile?.name} ${dataRelation.trainer_profile?.last_name}`}
                                </span>
                            </p>
                            <p className="text-sm text-gray-300">
                                {formatPhone(
                                    dataRelation.trainer_profile!.phone
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="w-auto h-[1px] mx-4 my-2 bg-gray-600" />
                    <div className="p-2 flex items-center gap-3">
                        <GiStairsGoal className="text-3xl" />
                        <div className="space-y-1">
                            <p className=" text-xs text-gray-300">
                                Objetivo:{" "}
                                <span className="text-sm text-white">
                                    {" "}
                                    {dataRelation.goal ||
                                        "No hay objetivo definido"}
                                </span>
                            </p>

                            <p className="text-xs text-gray-300">
                                Tu peso actual:{" "}
                                <span className="text-white text-sm">
                                    {dataRelation.progress.weight}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
