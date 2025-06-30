import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import api from "../../lib/config/axios";
import { CustomInput } from "../../components";
import { memberSchema, type MemberFormData } from "../../lib/types";
import { Link } from "react-router";
import { handleApiError } from "../../lib/utils/handleAPIError";
import { Button } from "../../components/attoms";

// Esta pagina solo es para registrar a los miembros, el administrador o staff se debe crear desde el dashboard privado por un administrador

export default function Register() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
            gender: "O",
            born_date: "",
        },
    });

    const onSubmit: SubmitHandler<MemberFormData> = async (
        formData: MemberFormData
    ) => {
        // Maneja el mensaje que sale para mostar un loading mientras realiza la operación
        toast.promise(api.post("/auth/sign-up", formData), {
            loading: "Registrando usuario...",
            success: (response) => {
                reset();
                return response.data.message;
            },
            error: (error) => handleApiError(error),
        });
    };
    return (
        <div className="w-full max-w-md space-y-2">
            <h1 className="text-2xl font-bold text-center ">Crear cuenta</h1>

            <form
                className="space-y-2 text-left"
                onSubmit={handleSubmit(onSubmit)}
            >
                <CustomInput
                    name="name"
                    control={control}
                    label="Nombre"
                    type="text"
                    error={errors.name}
                    placeholder="Ej. Julian"
                />
                <CustomInput
                    name="last_name"
                    control={control}
                    label="Apellidos"
                    type="text"
                    error={errors.last_name}
                    placeholder="Ej. Pérez Gómez"
                    maxLength={50}
                    minLength={2}
                />
                <CustomInput
                    name="email"
                    control={control}
                    label="Correo electrónico"
                    type="email"
                    error={errors.email}
                    placeholder="Ej. usuario@ejemplo.com"
                    maxLength={100}
                />
                <CustomInput
                    name="password"
                    control={control}
                    label="Contraseña"
                    type="password"
                    error={errors.password}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    maxLength={50}
                />
                <CustomInput
                    name="phone"
                    control={control}
                    label="Teléfono"
                    type="tel"
                    error={errors.phone}
                    placeholder="Ej. 1234567890"
                    maxLength={10}
                />
                <div className="flex gap-5 pb-3">
                    <CustomInput
                        name="gender"
                        control={control}
                        label="Género"
                        type="select"
                        error={errors.gender}
                        options={[
                            { value: "M", label: "Masculino" },
                            { value: "F", label: "Femenino" },
                        ]}
                    />
                    <CustomInput
                        name="born_date"
                        control={control}
                        label="Fecha de nacimiento"
                        type="date"
                        error={errors.born_date}
                        placeholder="MM-DD-YYYY"
                    />
                </div>

                <Button type="submit" className="m-auto">
                    Registrar cuenta
                </Button>
            </form>
            <div className="text-center text-sm text-gray-600">
                <p>
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        to="/"
                        className="font-medium text-gray-300 hover:text-white"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
