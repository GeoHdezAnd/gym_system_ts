import { useNavigate, useParams } from "react-router";
import { CustomInput } from "../../components";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    passwordSchemaLogin,
    type PasswordFormLogin,
} from "../../lib/schemas/auth";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/config/axios";
import { handleApiError } from "../../lib/utils/handleAPIError";

export default function ResetPassword() {
    const params = useParams();
    const { token } = params;
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordFormLogin>({
        resolver: zodResolver(passwordSchemaLogin),
        defaultValues: {
            password: "",
        },
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await api.post(`auth/validate-token/${token}`);
                setIsTokenValid(true);
                toast.success(response.data);
            } catch (error) {
                setIsTokenValid(false);
                toast.error(handleApiError(error));
            }
        };
        checkToken();
    }, [token]);

    const onSubmit: SubmitHandler<PasswordFormLogin> = async (
        formData: PasswordFormLogin
    ) => {
        toast.promise(api.post(`auth/reset-password/${token}`, formData), {
            success: (response) => {
                reset();
                setTimeout(() => {
                    navigate("/");
                }, 2000);
                return response.data;
            },
            error: (error) => handleApiError(error),
        });
    };

    if (isTokenValid === null) {
        return (
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center">
                    Validando token...
                </h1>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center">
                    Token inválido o expirado
                </h1>
                <p className="text-center text-gray-600">
                    El enlace de restablecimiento no es válido. Por favor
                    solicita uno nuevo.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <h1 className="text-2xl font-bold text-center">
                Restablecer contraseña
            </h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 text-left"
            >
                <CustomInput
                    name="password"
                    control={control}
                    label="Nueva contraseña"
                    type="password"
                    error={errors.password}
                    placeholder="******"
                />
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 cursor-pointer hover:bg-blue-800 transition transform duration-100 ease-in"
                >
                    Actualizar contraseña
                </button>
            </form>
        </div>
    );
}
