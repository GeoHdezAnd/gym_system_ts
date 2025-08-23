import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../lib/hooks/useAuth";
import { getTrainerById } from "../../../api/TrainerApi";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import { Link } from "react-router";
import { RiUserSettingsFill } from "react-icons/ri";
import { ImExit } from "react-icons/im";

export default function TrainerAccount() {
    const { auth, logOut } = useAuth();
    const id = auth?.id;

    const {
        data: trainerData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryFn: () => getTrainerById(id!),
        queryKey: ["userId", id],
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

    console.log(trainerData);
    return (
        <main className="text-white max-w-md -mx-1  grid text-center p-4 lg:p-1 space-y-3 overflow-auto">
            <h1 className="font-semibold text-2xl lg:text-xl">Cuenta</h1>
            <div className=" grid gap-5 pb-10">
                <div className="rounded-full ring-3 ring-secondary-200 shadow-2xs shadow-purple-950 m-auto ">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-gray-600 font-bold border-2 border-secondary-200 shadow text-3xl shadow-gray-600">
                        {trainerData?.name.charAt(0)}
                        {trainerData?.last_name.charAt(0)}
                    </div>
                </div>
                <div className="text-xl lg:text-sm space-y-2 lg:space-y-1">
                    <p className=" font-bold">
                        {`${trainerData?.name} ${trainerData?.last_name}`}{" "}
                    </p>
                    <p className="text-gray-300 text-sm">{trainerData.phone}</p>
                    <div className="grid  justify-center gap-2 items-center">
                        <p className="text-base text-gray-300">
                            Biografia:{" "}
                            <span className="text-sm text-white">
                                {" "}
                                {trainerData.profile.bio}
                            </span>
                        </p>

                        <p className="text-base text-gray-300">
                            Habilidades:{" "}
                            {trainerData.profile.skills.length === 0
                                ? "No hay habilidades"
                                : trainerData.profile.skills.map(
                                      (skill: string, index: number) => (
                                          <span
                                              className="text-white"
                                              key={skill}
                                          >
                                              {skill}
                                              {index !==
                                              trainerData.profile.skills
                                                  .length -
                                                  1
                                                  ? ", "
                                                  : ""}
                                          </span>
                                      )
                                  )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-left text-sm grid gap-2  bottom-0">
                <h2 className="font-semibold text-lg">Configuración</h2>
                <Link
                    to={"setting"}
                    className="flex items-center bg-gray-500/10 rounded-lg p-2 gap-2 hover:bg-gray-500/20"
                >
                    <RiUserSettingsFill className="text-3xl p-1 bg-gray-700/70 rounded-lg" />
                    <p>Perfil</p>
                </Link>
                <button
                    type="button"
                    className="cursor-pointer flex rounded-md items-center  p-2 gap-2 transform duration-20 bg-red-800/20 hover:bg-red-800/30 text-red-600 border-red-700"
                    onClick={logOut}
                >
                    <ImExit className="text-3xl p-1 rounded-lg" />
                    Cerrar sesión
                </button>
            </div>
        </main>
    );
}
