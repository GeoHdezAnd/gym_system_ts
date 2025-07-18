import { useForm, type SubmitHandler } from "react-hook-form";
import { RiUser3Fill } from "react-icons/ri";
import { MdEmail, MdPhoneInTalk, MdDateRange } from "react-icons/md";
import { TbGenderAndrogyne } from "react-icons/tb";
import { Button, CustomInput } from "../../attoms";
import { memberSchema } from "../../../lib/schemas/users";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";

const memberAddSchema = memberSchema.omit({ password: true });
export type MemberAddSchema = z.infer<typeof memberAddSchema>;

type FormMemberProps = {
    mode?: "create" | "edit";
    description: string;
    defaultValues?: Partial<MemberAddSchema>; // Partial crea un type del objeto que recibe
    onSubmit?: (data: MemberAddSchema) => Promise<void> | void;
    isLoading?: boolean;
};

export function FormMember({
    mode = "create",
    description,
    defaultValues,
    onSubmit,
    isLoading: externalLoading,
}: FormMemberProps) {
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
            ...defaultValues,
        },
    });

    const handleFormSubmit: SubmitHandler<MemberAddSchema> = async (
        formData: MemberAddSchema
    ) => {
        try {
            setIsSubmitting(true);

            if (onSubmit) {
                await onSubmit(formData);
                if (mode === "create") reset();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Combina el estado de envío del formulario con nuestro estado personalizado
    const isLoading = isFormSubmitting || externalLoading || isSubmitting;

    return (
        <div className="mb-8">
            <div className="mb-4 space-y-2">
                <h2 className="font-semibold text-lg ">Cliente</h2>
                <p className="text-sm text-gray-400">{description}</p>
            </div>

            <div className="space-y-6 bg-primary-200 rounded-md p-4 shadow-lg shadow-gray-950 border-1 border-gray-800">
                <form
                    className="space-y-4 "
                    onSubmit={handleSubmit(handleFormSubmit)}
                >
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
