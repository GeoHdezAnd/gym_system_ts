import { useQuery } from "@tanstack/react-query";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GrNext } from "react-icons/gr";
import { Link, useParams } from "react-router";
import {
    getAllWorksoutByRelationId,
    getRelationMemberTrainer,
} from "../../../api/RelationMemberTrainerAPI";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import { GiStairsGoal } from "react-icons/gi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { Button } from "../../../components/attoms";
import type { TWorkOutResponse } from "../../../lib/types/types";
import { formatDate } from "../../../lib/utils/formatInfo";

export default function MemberCoaching() {
    const { id } = useParams();
    const {
        data: relationData,
        isLoading: relationIsLoading,
        isError: relationIsError,
        error: relationError,
    } = useQuery({
        queryFn: () => getRelationMemberTrainer(id!),
        queryKey: ["relationMember", id],
        enabled: !!id,
    });
    // Consulta para los workouts, dependiente de relationData
    const {
        data: workoutsData,
        isLoading: workoutsIsLoading,
        isError: workoutsIsError,
        error: workoutsError,
    } = useQuery({
        queryFn: () => getAllWorksoutByRelationId(relationData.id!),
        queryKey: ["workouts", relationData?.id],
        enabled: !!relationData?.id, // Solo se habilita si tenemos relationData.id
    });

    if (relationIsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (relationIsError) {
        return (
            <ErrorMessage
                message="Error al cargar los datos"
                error={relationError!}
                className="my-4"
            />
        );
    }

    return (
        <main className="text-white max-w-md  m-auto grid text-center p-3 lg:p-1 space-y-3 overflow-auto">
            <Link className="hover:text-pink-800" to={"/trainer/coaching"}>
                <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
            </Link>
            <div className="p-4 items-center space-x-3 bg-primary-300 hover:bg-primary-200 rounded-lg border border-gray-600">
                <div className="flex gap-2 items-center">
                    <div className="rounded-full ring-2 ring-secondary-200 shadow-2xs shadow-purple-950 ">
                        <img
                            className="rounded-full"
                            src={`${
                                relationData.member_profile.gender === "M"
                                    ? "/male-avatar.png"
                                    : "/female-avatar.png"
                            }`}
                            width={60}
                            alt="customer-photo"
                        />
                    </div>

                    <div className="flex-1 text-left px-2">
                        <p className="text-lg font-semibold">{`${relationData.member_profile.name} ${relationData.member_profile.last_name}`}</p>
                        <p className="text-gray-300">
                            <span>Tel: </span>
                            {relationData.member_profile.phone}
                        </p>
                    </div>
                </div>
                <div className="w-auto h-[1px]  my-4 bg-gray-600" />
                <div className="px-2 flex items-center gap-8 text-left">
                    <GiStairsGoal className="text-3xl" />
                    <div className=" flex-1">
                        <p className=" text-sm text-gray-300">
                            Objetivo:{" "}
                            <span className=" text-white">
                                {" "}
                                {relationData.goal ||
                                    "No hay objetivo definido"}
                            </span>
                        </p>

                        <p className="text-sm text-gray-300">
                            Peso:{" "}
                            <span className="text-white">
                                {relationData.progress.weight} kg
                            </span>
                        </p>
                        <p className="text-sm text-gray-300">
                            Notas:{" "}
                            <span className="text-white">
                                {relationData.notes}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-2">
                <div className="flex gap-2 justify-between">
                    <h3 className="font-semibold text-lg">Entrenamientos</h3>
                    <Button className=" mb-3">
                        <Link
                            to={"create-workout"}
                            className="flex items-center gap-5"
                        >
                            Agregar rutina{" "}
                            <MdOutlineAddCircleOutline className="text-xl" />{" "}
                        </Link>
                    </Button>
                </div>

                {workoutsIsLoading && (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                )}
                {workoutsIsError && (
                    <ErrorMessage
                        message="Error al cargar los datos"
                        error={workoutsError!}
                        className="my-4"
                    />
                )}
                <div className="py-2 ">
                    {workoutsData?.length === 0 ? (
                        <p>Sin rutinas registradas aún</p>
                    ) : (
                        workoutsData?.map((workOut: TWorkOutResponse) => (
                            <WorkOut key={workOut.id} workOut={workOut} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

const WorkOut = ({ workOut }: { workOut: TWorkOutResponse }) => {
    return (
        <div className="p-4 my-2 items-center flex justify-between bg-primary-300 hover:bg-primary-200 rounded-lg border border-gray-600">
            <div className="text-left space-y-1">
                <h3 className="font-medium text-xl">{workOut.name}</h3>
                <p className="text-sm">
                    <span className="text-gray-200 text-md">
                        Fecha inicio:{" "}
                    </span>
                    {formatDate(workOut.start_date)}
                </p>
                <p className="text-sm">
                    <span className="text-gray-200 text-md">Fecha fin: </span>
                    {formatDate(workOut.end_date)}
                </p>
                <p className="text-sm">
                    <span className="text-gray-200 text-md">
                        Número de ejercicios:{" "}
                    </span>
                    {workOut.exercises.length}
                </p>
            </div>
            <Link to={`workout/${workOut.id}`}>
                <GrNext className="text-gray-200 text-4xl hover:text-secondary-200 cursor-pointer" />
            </Link>
        </div>
    );
};
