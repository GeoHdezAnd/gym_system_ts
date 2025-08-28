import { useQuery } from "@tanstack/react-query";
import { IoCloseSharp } from "react-icons/io5";
import { Link, useParams } from "react-router";
import { getWorkOutById } from "../../../../api/RelationMemberTrainerAPI";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../../components/attoms/ErrorMessage";
import { FormWorkOut } from "../../../../components/organisms/clientTrainerApp/FormWorkOut";

export default function Workout() {
    const { idWorkout } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getWorkOutById(idWorkout!),
        queryKey: ["workout", idWorkout],
        enabled: !!idWorkout,
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
                message="Error al cargar los datos"
                error={error!}
                className="my-4"
            />
        );
    }
    console.log(idWorkout);
    return (
        <main className="text-white max-w-md mx-auto grid p-4 lg:p-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
                <Link
                    className="hover:text-pink-800 flex items-center"
                    to={`/user/training`}
                >
                    <IoCloseSharp className="text-3xl cursor-pointer" />
                </Link>
                <h1 className="font-semibold text-xl flex-grow text-center">
                    Rutina
                </h1>
                <div className="w-8" />
            </div>
            <FormWorkOut defaultValues={data} disabled={true} />
        </main>
    );
}
