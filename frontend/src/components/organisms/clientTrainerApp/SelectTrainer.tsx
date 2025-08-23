import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "../../../api/TrainerApi";
import { LoadingSpinner } from "../../attoms/LoadingSpinner";
import { ErrorMessage } from "../../attoms/ErrorMessage";
import type { TrainerProps } from "../../../lib/types/types";
import { useMemo } from "react";

type Props = {
    selectedTrainer?: {
        id: string;
        name: string;
        last_name: string;
    };
    onSelectTrainer: (trainer: {
        id: string;
        name: string;
        last_name: string;
    }) => void;
};

export const SelectTrainer = ({ selectedTrainer, onSelectTrainer }: Props) => {
    // Use Query para obtener los entrenadores
    const {
        data: dataTrainers,
        isLoading: isLoadingTrainers,
        isError: isErrorTrainers,
        error: errorTrainers,
    } = useQuery({
        queryFn: (): Promise<TrainerProps[]> => getTrainers(),
        queryKey: ["trainers"],
    });

    // Ordenar entrenadores: el seleccionado primero, luego los demás
    const sortedTrainers = useMemo(() => {
        if (!dataTrainers) return [];

        const selectedTrainerCheck = dataTrainers.find(
            (trainer) => trainer.id === selectedTrainer?.id
        );
        const otherTrainers = dataTrainers.filter(
            (trainer) => trainer.id !== selectedTrainer?.id
        );

        return selectedTrainerCheck
            ? [selectedTrainerCheck, ...otherTrainers]
            : [...otherTrainers];
    }, [dataTrainers, selectedTrainer]);

    if (isLoadingTrainers) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isErrorTrainers) {
        return (
            <ErrorMessage
                message="Error al cargar los datos"
                error={errorTrainers!}
                className="my-4"
            />
        );
    }

    return (
        <div className="text-gray-300 text-sm py-3 space-y-2 overflow-y-auto max-h-96 my-2">
            {sortedTrainers?.map((trainer) => (
                <div
                    key={trainer.id}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                        selectedTrainer?.id === trainer.id
                            ? "bg-green-600/60 border border-green-500"
                            : "bg-primary-300 hover:bg-primary-600"
                    }`}
                    onClick={() => onSelectTrainer(trainer)}
                >
                    <div className="flex items-center space-x-3">
                        {/* Avatar/Iniciales */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-800 font-bold">
                            {trainer.name.charAt(0)}
                            {trainer.last_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-white font-medium truncate">
                                {trainer.name} {trainer.last_name}
                            </p>
                            <div className="flex gap-2 mt-1">
                                {trainer.profile.skills
                                    ?.slice(0, 3)
                                    .map((skill, index) => (
                                        <span
                                            key={index}
                                            className="text-xs py-0.5 rounded-full bg-primary-400 text-white"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                {trainer.profile.skills?.length > 3 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-400 text-white">
                                        +{trainer.profile.skills.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
