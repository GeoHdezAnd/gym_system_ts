import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { getTrainerById, updateTrainer } from "../../../../api/TrainerApi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import { FaUserEdit } from "react-icons/fa";
import { MdGroups3 } from "react-icons/md";
import clsx from "clsx";
import {
    FormTrainer,
    type TrainerAddSchema,
} from "../../../../components/organisms/users";
import { toast } from "sonner";
import { handleApiError } from "../../../../lib/utils/handleAPIError";

export default function TrainerEdit() {
    const { trainerId, action } = useParams();
    const [menu, setMenu] = useState<string>(action!);
    const { data, isLoading, isError } = useQuery({
        queryFn: () => getTrainerById(trainerId!),
        queryKey: ["trainerId", trainerId],
    });

    const queryClient = useQueryClient();

    // Actualizar entrenador
    const handleUpdateTrainer = async (data: TrainerAddSchema) => {
        await updateTrainer(trainerId!, data);
    };

    // Mutation para actualizar entrenador
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateTrainer,
        onSuccess: () => {
            toast.success("Entrenador actualizado correctamente");
            queryClient.invalidateQueries({
                queryKey: ["trainerId", trainerId],
            });
        },
        onError: (error: Error) => {
            toast.error(handleApiError(error));
            console.log(error);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError || !trainerId)
        return <p className="m-auto text-gray-300">Id invalido</p>;

    const defaultValues = data
        ? {
              name: data.name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              bio: data.profile.bio,
              skills: data.profile.skills,
          }
        : undefined;

    const options = [
        { value: "edit", label: "Datos personales", icon: <FaUserEdit /> },
        {
            value: "customers",
            label: "Clientes asignados",
            icon: <MdGroups3 />,
        },
    ];

    return (
        <div className="container text-white">
            <div className="flex gap-2 items-center mb-3">
                <Link
                    className="hover:text-pink-800"
                    to={"/dashboard/user/trainer/all"}
                >
                    <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
                </Link>

                <h1 className="text-2xl ">{`${data.name} ${data.last_name}`}</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-2 line">
                {/* Panel lateral izquierdo (Menú de navegación) */}
                <div className="w-full  md:w-1/4  p-2 xs:border-b-1 md:border-r-1   border-gray-600 shadow">
                    <h2 className=" text-lg mb-4 ">Tipo de información</h2>
                    <ul className="space-y-2 flex overflow-x-auto pr-4  md:grid">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => setMenu(option.value)}
                                    className={clsx(
                                        "w-full cursor-pointer text-left flex text-sm gap-2 items-center px-3 py-1 rounded-lg transition-all duration-200",
                                        "hover:bg-gray-900/60 hover:text-white",
                                        "focus:ring-opacity-50",
                                        menu === option.value
                                            ? "bg-primary-200  text-white shadow-md border border-gray-700"
                                            : "text-gray-400 bg-gray-900/40"
                                    )}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contenido principal segun opción */}
                <div className="w-full  px-2 py-2 shadow mx-0 lg:mx-12">
                    {menu === "edit" && (
                        <FormTrainer
                            mode="edit"
                            description="Edita la información del entrenador"
                            defaultValues={defaultValues}
                            isLoading={mutationUpdate.isPending}
                            onSubmit={async (data) => {
                                mutationUpdate.mutate(data);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
