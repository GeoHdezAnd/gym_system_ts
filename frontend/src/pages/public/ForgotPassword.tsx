import { useForm, type SubmitHandler } from "react-hook-form";
import { forgotPasswordSchema, type ForgotPasswordForm } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../components";
import { toast } from "sonner";
import api from "../../lib/config/axios";
import { handleApiError } from "../../lib/utils/handleAPIError";

export default function ForgotPassword() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit: SubmitHandler<ForgotPasswordForm> = async (formData) => {
        console.log(formData)
        toast.promise(api.post("/auth/forgot-password", formData), {
            loading: "Enviando petición...",
            success: (response) => {
                reset();
                return response.data || "Operación exitosa";
            },
            error: (error) => handleApiError(error),
        });
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-center ">
                    Olvidé contraseña
                </h1>
                <p>Ingresa tu correo para enviar instrucciones</p>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 text-left"
            >
                <CustomInput
                    name="email"
                    control={control}
                    label="Email"
                    type="email"
                    error={errors.email}
                    placeholder="correo@correo.com"
                />
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 cursor-pointer hover:bg-blue-800 transition transform duration-100 ease-in"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
