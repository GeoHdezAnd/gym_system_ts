import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../lib/config/axios";
import { toast } from "sonner";
import { handleApiError } from "../../lib/utils/handleAPIError";

export default function ConfirmAccount() {
    const params = useParams();
    const { token } = params;
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                if (!token) {
                    setError("Token no proporcionado");
                    return;
                }
                const response = await api.post(`auth/confirm-account`, {
                    token,
                });

                setIsTokenValid(true);
                toast.success(response.data);
                setTimeout(() => {
                    navigate("/");
                }, 3000);
                
            } catch (error) {
                setIsTokenValid(false);
                setError("Token no valido o expirado");
                toast.error(handleApiError(error));
            } finally {
                setIsLoading(false);
            }
        };

        confirmAccount();
    }, [token, navigate]);

    if (isLoading) {
        return (
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center">
                    Confirmar cuenta
                </h1>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-center text-gray-600">
                    Verificando tu cuenta...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center text-red-500">
                    {error}
                </h1>
            </div>
        );
    }

    if (isTokenValid) {
        return (
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center text-green-500">
                    ¡Cuenta confirmada!
                </h1>
                <p className="text-center text-gray-600">
                    Tu cuenta ha sido verificada correctamente.
                </p>
                <p className="text-center text-gray-600">
                    Serás redirigido automáticamente...
                </p>
            </div>
        );
    }

    return null;
}
