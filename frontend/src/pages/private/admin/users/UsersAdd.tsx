import { useState } from "react";
import clsx from "clsx";
import { TbUsers, TbUserCog, TbUserBolt } from "react-icons/tb";
import { FormMemberAdd } from "../../../../components/organisms";

export default function UsersAdd() {
    const [credential, setCredential] = useState<string>("client");

    const credentialOptions = [
        { value: "client", label: "Cliente", icon: <TbUsers /> },
        { value: "admin", label: "Administrador", icon: <TbUserCog /> },
        { value: "trainer", label: "Entrenador", icon: <TbUserBolt /> },
    ];

    return (
        <div className="container mx-auto p-6 max-w-6xl text-white">
            <h1 className="text-2xl font-semibold  mb-6">Agregar usuario</h1>

            <div className="flex flex-col md:flex-row gap-6 line">
                {/* Panel lateral izquierdo (Menú de navegación) */}
                <div className="w-full md:w-1/4  p-2 border-r-1 border-gray-600 shadow">
                    <h2 className=" text-lg mb-4 font-medium">Credenciales</h2>
                    <ul className="space-y-3">
                        {credentialOptions.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => setCredential(option.value)}
                                    className={clsx(
                                        "w-full text-left flex  gap-4 items-center px-3 py-2 rounded-lg transition-all duration-200",
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
                <div className="w-full md:w-3/4 px-6 py-2 shadow">
                    {/* Formulario según el tipo de credencial */}
                    {credential === "client" && <FormMemberAdd />}
                </div>
            </div>
        </div>
    );
}
