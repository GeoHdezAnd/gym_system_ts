import { useState } from "react";
import clsx from "clsx";
import { TbUsers, TbUserCog, TbUserBolt } from "react-icons/tb";
import {
    FormMember,
    FormAdmin,
    type MemberAddSchema,
    FormTrainer,
    type TrainerAddSchema,
} from "../../../../components/organisms/admin";
import { toast } from "sonner";
import api from "../../../../lib/config/axios";
import { handleApiError } from "../../../../lib/utils/handleAPIError";
import type { AdminFormData } from "../../../../lib/schemas/users";

export default function UsersAdd() {
    const [credential, setCredential] = useState<string>("client");

    const credentialOptions = [
        { value: "client", label: "Cliente", icon: <TbUsers /> },
        { value: "admin", label: "Administrador", icon: <TbUserCog /> },
        { value: "trainer", label: "Entrenador", icon: <TbUserBolt /> },
    ];

    const onSubmitMember = (data: MemberAddSchema) => {
        toast.promise(api.post("/member", data), {
            loading: "Registrando usuario...",
            success: (response) => {
                const { matricula, message } = response.data;

                return `${message}: ${matricula}`;
            },
            error: (error) => {
                return handleApiError(error);
            },
        });
    };

    const onSubmitAdmin = (data: AdminFormData) => {
        toast.promise(api.post("/auth/admin/sign-up", data), {
            loading: "Registrando usuario...",
            success: (response) => {
                const { message } = response.data;

                return `${message}`;
            },
            error: (error) => {
                return handleApiError(error);
            },
        });
    };

    const onSubmitTrainer = (data: TrainerAddSchema) => {
        toast.promise(api.post("/trainer", data), {
            loading: "Registrando miembro",
            success: (response) => {
                const { message } = response.data;
                return message;
            },
            error: (error) => {
                return handleApiError(error);
            },
        });
    };

    return (
        <div className="container  text-white">
            <h1 className="text-2xl font-semibold  mb-6">Agregar usuario</h1>

            <div className="flex flex-col md:flex-row gap-2 line">
                {/* Panel lateral izquierdo (Menú de navegación) */}
                <div className="w-full  md:w-1/4  p-2 xs:border-b-1 md:border-r-1   border-gray-600 shadow">
                    <h2 className=" text-lg mb-4 font-medium">
                        Tipo de usuario
                    </h2>
                    <ul className="space-y-2 flex overflow-x-auto pr-4  md:grid">
                        {credentialOptions.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => setCredential(option.value)}
                                    className={clsx(
                                        "w-full text-left flex text-sm gap-4 items-center px-2 py-1 rounded-lg transition-all duration-200",
                                        "hover:bg-gray-900/60 hover:text-white",
                                        "focus:ring-opacity-50",
                                        credential === option.value
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

                {/* Contenido principal */}
                <div className="w-full  px-2 py-2 shadow mx-0 lg:mx-12">
                    {/* Formulario según el tipo de credencial */}
                    {credential === "client" && (
                        <FormMember
                            mode="create"
                            description="Ingresa la información del cliente, indique al cliente la
                    matricula que te da como respuesta el envio del formulario"
                            onSubmit={async (data) => {
                                onSubmitMember(data);
                            }}
                        />
                    )}
                    {credential === "admin" && (
                        <FormAdmin
                            mode="create"
                            description="Ingresa la información del administrador y asigna niveles de acceso"
                            onSubmit={async (data) => {
                                onSubmitAdmin(data);
                            }}
                        />
                    )}
                    {credential === "trainer" && (
                        <FormTrainer
                            mode="create"
                            description="Ingresa la información del entrenador"
                            onSubmit={async (data) => {
                                onSubmitTrainer(data);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
