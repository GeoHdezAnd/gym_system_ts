import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getMemberByID, updateMember } from "../../../../api/MemberApi";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "../../../../components/attoms/LoadingSpinner";
import {
    FormMember,
    type MemberAddSchema,
} from "../../../../components/organisms/admin";
import { toast } from "sonner"; // o el paquete de toast que uses
import { handleApiError } from "../../../../lib/utils/handleAPIError";
import { IoIosArrowRoundBack } from "react-icons/io";
import { CgGym } from "react-icons/cg";
import { SubscriptionManagement } from "../../../../components/organisms/subscriptions/SubscriptionManagement";

export default function CustomerEdit() {
    const { userId, action } = useParams();
    const [menu, setMenu] = useState<string>(action!);
    const { data, isLoading, error } = useQuery({
        queryFn: () => getMemberByID(userId!),
        queryKey: ["memberId", userId],
    });

    // Actualizar miembro
    const handleUpdateMember = async (data: MemberAddSchema) => {
        await updateMember(userId!, data);
    };

    // Mutation para actualizar miembro
    const mutationUpdate = useMutation({
        mutationFn: handleUpdateMember,
        onSuccess: () => {
            toast.success("Usuario actualizado correctamente");
        },
        onError: (error: Error) => {
            toast.error(handleApiError(error));
            console.error(error);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !userId)
        return <p className="m-auto text-gray-300">Id invalido</p>;

    const defaultValues = data
        ? {
              name: data.name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              gender: data.profile.gender,
              born_date: data.profile.born_date,
          }
        : undefined;

    const options = [
        { value: "edit", label: "Datos personales", icon: <FaUserEdit /> },
        { value: "subscription", label: "Suscripción", icon: <CgGym /> },
    ];

    return (
        <div className="container text-white">
            <div className="flex gap-2 items-center mb-3">
                <Link
                    className="hover:text-pink-800"
                    to={"/dashboard/user/customer/all"}
                >
                    <IoIosArrowRoundBack className="text-3xl cursor-pointer" />
                </Link>

                <h1 className="text-2xl ">{`${data!.name} ${
                    data!.last_name
                }`}</h1>
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
                <div className="w-full  py-2 shadow mx-0 lg:mx-12">
                    {menu === "edit" && (
                        <FormMember
                            mode="edit"
                            description="Edita la información del usuario si lo deseas"
                            defaultValues={defaultValues}
                            isLoading={mutationUpdate.isPending}
                            onSubmit={async (data) => {
                                mutationUpdate.mutate(data);
                            }}
                        />
                    )}
                    {menu === "subscription" && (
                        <SubscriptionManagement userId={userId!} />
                    )}
                </div>
            </div>
        </div>
    );
}
