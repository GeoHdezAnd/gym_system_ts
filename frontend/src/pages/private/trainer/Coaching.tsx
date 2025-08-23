import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../lib/hooks/useAuth";
import { getAdvisedByTrainerId } from "../../../api/RelationMemberTrainerAPI";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import type { TAdvisedResponse } from "../../../lib/types/types";
import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router";

export default function Coaching() {
    const { auth } = useAuth();
    const id = auth?.id;

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getAdvisedByTrainerId(id!),
        queryKey: ["adviced", id],
        enabled: !!id,
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

    return (
        <main className="text-white max-w-md -mx-1  grid text-center p-4 lg:p-1 space-y-3 overflow-auto">
            <h1 className="font-semibold text-2xl lg:text-xl">Asesorados</h1>
            <div className="py-2 space-y-4">
                {data.lenght === 0 ? (
                    <p>No tienes asesorados aún</p>
                ) : (
                    data.map((advised: TAdvisedResponse, index: number) => (
                        <Advised advised={advised} key={index} />
                    ))
                )}
            </div>
        </main>
    );
}

const Advised = ({ advised }: { advised: TAdvisedResponse }) => {
    return (
        <div className="flex p-3 items-center space-x-3 bg-primary-300 hover:bg-primary-200 rounded-lg border border-gray-600">
            <div className="rounded-full ring-2 ring-secondary-200 shadow-2xs shadow-purple-950 ">
                <img
                    className="rounded-full"
                    src={`${
                        advised.member.gender === "M"
                            ? "/male-avatar.png"
                            : "/female-avatar.png"
                    }`}
                    width={60}
                    alt="customer-photo"
                />
            </div>
            <div className="flex-1 space-y-1 text-left">
                <p>{`${advised.member.name} ${advised.member.last_name}`}</p>
                <p className="text-gray-300 text-sm">
                    <span>Tel: </span>
                    {advised.member.phone}
                </p>
                <p className="text-sm text-gray-300">
                    <span>Objetivo: </span>
                    {advised.relation.goal || "No hay objetivo"}
                </p>
            </div>
            <Link
                to={`${advised.member.id}`}
                className="cursor-pointer hover:text-secondary-200"
            >
                <MdArrowForwardIos className="text-2xl" />
            </Link>
        </div>
    );
};
