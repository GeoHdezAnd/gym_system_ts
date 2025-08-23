import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../lib/hooks/useAuth";
import { getMemberByID } from "../../../api/MemberApi";
import { LoadingSpinner } from "../../../components/attoms/LoadingSpinner";
import { ErrorMessage } from "../../../components/attoms/ErrorMessage";
import { calculateAge } from "../../../lib/utils/dateUtils";
import { RiUserSettingsFill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { MdOutlineFactCheck } from "react-icons/md";
import { getSubscriptionsByUserId } from "../../../api/SubscriptionApi";
import type { SubsciptionMemberInfo } from "../../../lib/types/types";
import { formatDate } from "../../../lib/utils/formatInfo";
import clsx from "clsx";
import { Link } from "react-router";

export default function UserAccount() {
    const { auth, logOut } = useAuth();
    const id = auth?.id;
    const {
        data: userData,
        isLoading: userLoading,
        isError: userIsError,
        error: userError,
    } = useQuery({
        queryFn: () => getMemberByID(id!),
        queryKey: ["userId", id],
        enabled: !!id,
    });

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

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (userIsError) {
        return (
            <ErrorMessage
                message="Error al cargar los datos"
                error={userError!}
                className="my-4"
            />
        );
    }
    const subscriptions: SubsciptionMemberInfo[] = subscriptionsData || [];
    // Calcula la edad si existe born_date
    const age = userData?.profile.born_date
        ? calculateAge(userData.profile.born_date)
        : null;
    return (
        <main className="text-white  grid text-center p-4 lg:p-1 space-y-3 overflow-auto">
            <h1 className="font-semibold text-2xl lg:text-xl">Cuenta</h1>
            <div className=" grid gap-5 pb-10">
                <div className="rounded-full ring-6 ring-secondary-200 shadow-2xs shadow-purple-950 m-auto ">
                    <img
                        className="rounded-full"
                        src={`${
                            userData!.profile.gender === "M"
                                ? "/male-avatar.png"
                                : "/female-avatar.png"
                        }`}
                        width={160}
                        alt="customer-photo"
                    />
                </div>
                <div className="text-xl lg:text-sm space-y-2 lg:space-y-1">
                    <p className=" font-bold">
                        {`${userData?.name} ${userData?.last_name}`}{" "}
                    </p>
                    <p className="text-gray-300">{age} años</p>
                    <p className="text-gray-300 text-sm">
                        Matricula: {userData?.profile.matricula}
                    </p>

                    <p
                        className={`px-3 cursor-pointer inline-flex text-sm leading-2.5 font-semibold rounded-md border p-2  ${
                            userData!.profile.status === "active"
                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                        }`}
                    >
                        {userData!.profile.status === "active"
                            ? "Activo"
                            : "Sin suscripción"}
                    </p>
                </div>
            </div>
            <div className="text-left pb-5">
                <h2 className="font-semibold text-lg pb-2">
                    Historial de suscripciones
                </h2>
                {subscriptionsLoading && (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                )}

                {subscriptionIsError && (
                    <ErrorMessage
                        message="Error al cargar los datos"
                        error={subscriptionError!}
                        className="my-4"
                    />
                )}
                {subscriptions.length === 0 ? (
                    <p className="text-xs text-gray-300">
                        No tiene suscripciones aún, adquiera una en recepción
                    </p>
                ) : (
                    <div className="bg-gray-900/20 space-y-3">
                        {subscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                className="bg-gray-700/25 py-2 rounded-lg shadow-sm shadow-gray-700 flex gap-4 px-4 lg:px-6  items-center "
                            >
                                <MdOutlineFactCheck className="text-3xl" />
                                <div className="space-y-2 flex-1 ">
                                    <div className="flex justify-between items-center">
                                        <p>{subscription.plan.name}</p>
                                        <p className="text-sm text-gray-300">
                                            Duración:{" "}
                                            {subscription.plan.duration_days}{" "}
                                            días
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-300">
                                            Fecha inicio:{" "}
                                            <span className="text-gray-100">
                                                {formatDate(
                                                    subscription.start_date
                                                ) ?? "—"}
                                            </span>
                                        </p>
                                        <p className="text-gray-300">
                                            Fecha fin:{" "}
                                            <span
                                                className={clsx(
                                                    subscription.status ===
                                                        "active"
                                                        ? "text-gray-100"
                                                        : "text-red-600"
                                                )}
                                            >
                                                {formatDate(
                                                    subscription.end_date
                                                ) ?? "—"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="text-left text-sm grid gap-2  bottom-0">
                <h2 className="font-semibold text-lg">Configuración</h2>
                <Link to={"setting"} className="flex items-center bg-gray-500/10 rounded-lg p-2 gap-2 hover:bg-gray-500/20">
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
