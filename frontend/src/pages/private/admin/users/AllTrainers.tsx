import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "../../../../api/TrainerApi";
import { TrainerTable } from "../../../../components/organisms/users";

export default function AllTrainers() {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getTrainers(),
        queryKey: ["trainers"],
    });

    return (
        <div className="container  text-white space-y-4 ">
            <>
                <h1 className="text-2xl font-semibold  mb-2">Entrenadores</h1>
                <p className="text-sm text-gray-300">
                    Centro de control de entrenadores
                </p>
            </>
            <TrainerTable
                data={data || []}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
        </div>
    );
}
