import { GrNext } from "react-icons/gr";
import type { TWorkOutResponse } from "../../lib/types/types";
import { formatDate } from "../../lib/utils/formatInfo";
import { Link } from "react-router";

export const WorkOut = ({ workOut }: { workOut: TWorkOutResponse }) => {
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
