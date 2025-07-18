import { useState } from "react";
import { adminSchema, type AdminFormData } from "../../../lib/schemas/users";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CustomInput } from "../../attoms";
import { MdEmail, MdPhoneInTalk } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import { FaKey } from "react-icons/fa6";
import { ToggleButton } from "../../attoms/ToggleButton";

type Props = {
    mode?: "create" | "edit";
    description: string;
    defaultValues?: Partial<AdminFormData>;
    onSubmit?: (data: AdminFormData) => Promise<void> | void;
    isLoading?: boolean;
};

export const FormAdmin = ({
    mode = "create",
    description,
    defaultValues,
    onSubmit,
    isLoading: externalLoading,
}: Props) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting: isFormSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            name: "",
            last_name: "",
            email: "",
            phone: "",
            access_level: "limited" as const,
            ...defaultValues,
        },
    });

    const handleFormSubmit: SubmitHandler<AdminFormData> = async (
        formData: AdminFormData
    ) => {
        try {
            setIsSubmitting(true);
            if (onSubmit) {
                await onSubmit(formData);
                if (mode === "create") reset();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = (accessFull: boolean) => {
        setValue("access_level", accessFull ? "full" : "limited");
    };

    const checkAccessValue = () => {
        const access = watch("access_level");
        return access === "full" ? true : false;
    };

    // Combina el estado de envío del formulario con nuestro estado personalizado
    const isLoading = isFormSubmitting || externalLoading || isSubmitting;
    return (
        <div className="mb-8">
            <div className="mb-4 space-y-2">
                <h2 className="font-semibold text-lg ">Admin</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="space-y-6 bg-primary-200 rounded-md p-4 shadow-lg shadow-gray-950 border-1 border-gray-800">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4 "
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

                    <div className="lg:flex px-2 justify-between items-center">
                        <div className="flex gap-2 items-center ">
                            <FaKey className="" />
                            <p className="text-sm gap-2 font-medium lg:pr-4 max-w-24">
                                Permisos completos
                            </p>
                            <ToggleButton
                                onToggle={handleToggle}
                                initialState={checkAccessValue()}
                            />
                        </div>
                        <p className="text-xs text-gray-400 p-2">
                            ** El acceso completo da acceso a funcionalidades
                            como eliminado en bloque
                        </p>
                    </div>

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
};
