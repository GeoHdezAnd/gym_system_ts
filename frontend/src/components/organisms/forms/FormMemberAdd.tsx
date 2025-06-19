import { useForm, type SubmitHandler } from "react-hook-form";
import { RiUser3Fill } from "react-icons/ri";
import { MdEmail, MdPhoneInTalk, MdDateRange } from "react-icons/md";
import { TbGenderAndrogyne } from "react-icons/tb";
import { Button, CustomInput } from "../../attoms";
import { memberSchema } from "../../../lib/types";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "../../../lib/config/axios";
import { handleApiError } from "../../../lib/utils/handleAPIError";
import { useState } from "react";

const memberAddSchema = memberSchema.omit({ password: true });
type MemberAddSchema = z.infer<typeof memberAddSchema>;

export function FormMemberAdd() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting: isFormSubmitting },
        reset,
    } = useForm<MemberAddSchema>({
        resolver: zodResolver(memberAddSchema),
        defaultValues: {
            name: "",
            last_name: "",
            email: "",
            phone: "",
            gender: "O",
            born_date: "",
        },
    });

    const onSubmit: SubmitHandler<MemberAddSchema> = async (
        formData: MemberAddSchema
    ) => {
        try {
            setIsSubmitting(true);

            toast.promise(api.post("/member", formData), {
                loading: "Registrando usuario...",
                success: (response) => {
                    reset(); // Limpia el formulario después del éxito
                    const { member, message } = response.data;

                    return `${message}: ${member}`;
                },
                error: (error) => {
                    throw error; // Propaga el error para manejarlo en el catch
                },
            });
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Combina el estado de envío del formulario con nuestro estado personalizado
    const isLoading = isSubmitting || isFormSubmitting;

    return (
        <div className="mb-8">
            <div className="mb-4 space-y-2">
                <h2 className="font-semibold text-lg ">Cliente</h2>
                <p className="text-sm text-gray-500">
                    Ingresa la información del cliente, indique al cliente la
                    matricula que te da como respuesta el envio del formulario
                </p>
            </div>

            <div className="space-y-6 bg-primary-200 rounded-md p-4 shadow-lg shadow-gray-950 border-1 border-gray-800">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <CustomInput
                        name="name"
                        control={control}
                        label="Nombre(s)"
                        type="text"
                        error={errors.name}
                        icon={<RiUser3Fill />}
                        placeholder="Oliver"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="last_name"
                        control={control}
                        label="Apellidos"
                        type="text"
                        error={errors.last_name}
                        icon={<RiUser3Fill />}
                        placeholder="Andrés Gómez"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="email"
                        control={control}
                        label="Correo"
                        type="email"
                        error={errors.email}
                        icon={<MdEmail />}
                        placeholder="correo@correo.com"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="phone"
                        control={control}
                        label="Télefono"
                        type="tel"
                        maxLength={10}
                        error={errors.phone}
                        icon={<MdPhoneInTalk />}
                        placeholder="2221234789"
                    />
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                    <CustomInput
                        name="gender"
                        control={control}
                        label="Genero"
                        type="select"
                        error={errors.gender}
                        icon={<TbGenderAndrogyne />}
                        options={[
                            { value: "M", label: "Masculino" },
                            { value: "F", label: "Femenino" },
                        ]}
                    />
                    <CustomInput
                        name="born_date"
                        icon={<MdDateRange />}
                        control={control}
                        label="Nacimiento"
                        type="date"
                        error={errors.born_date}
                        placeholder="MM-DD-YYYY"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Enviar formulario
                    </Button>
                </form>
            </div>
        </div>
    );
}
