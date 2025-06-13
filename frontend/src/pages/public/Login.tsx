import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../components";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../../lib/config/axios";
import { Link, useNavigate } from "react-router";
import useAuth from "../../lib/hooks/useAuth";
import { loginSchema, type LoginFormData } from "../../lib/types";

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "correo23@correo.com",
            password: "perro12.H",
        },
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (
        formData: LoginFormData
    ) => {
        try {
            const { data } = await api.post(`/auth/sign-in`, formData);
            const success = await signIn(data); // <-- Espera a que complete
            if (success) {
                navigate("/dashboard"); // <-- Navega solo si fue exitoso
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error.message);
            }
        }
    };
    return (
        <div className="w-full max-w-md space-y-6">
            <h1 className="text-2xl font-bold text-center ">
                Inicio de sesión
            </h1>

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

                <CustomInput
                    name="password"
                    control={control}
                    label="Password"
                    type="password"
                    error={errors.password}
                    placeholder="******"
                />

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 cursor-pointer hover:bg-blue-800 transition transform duration-100 ease-in"
                >
                    Iniciar sesión
                </button>
            </form>

            <div className="text-center text-sm text-gray-600 flex justify-between">
                <div className="flex gap-2">
                    <p>¿No Tienes cuenta?</p>
                    <Link
                        to="/sign-up"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Registrate
                    </Link>
                </div>

                <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Olvide contraseña
                </Link>
            </div>
        </div>
    );
}
