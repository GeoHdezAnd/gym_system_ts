import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Button, CustomInput } from "../../../attoms";
import { planSchema, type PlanFormData } from "../../../../lib/schemas/plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiNewspaperLine, RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdDiscount } from "react-icons/md";
import { GiDuration } from "react-icons/gi";
import { IoFlash } from "react-icons/io5";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { ToggleButton } from "../../../attoms/ToggleButton";

type PlanFormProps = {
    mode?: "create" | "edit";
    defaultValues?: Partial<PlanFormData>;
    onSubmit?: (data: PlanFormData) => Promise<void> | void;
    isLoading?: boolean;
};

export const FormPlan = ({
    mode = "create",
    defaultValues,
    onSubmit,
    isLoading: externalLoading,
}: PlanFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting: isFormSubmitting },
    } = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            duration_days: 0,
            application_access: false,
            benefits: [""],
            ...defaultValues,
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "benefits", // No preocuparse por el error que arroja TS, funciona correctamente
        control,
    });

    useEffect(() => {
        if (fields.length === 0) {
            append("");
        }
    }, [fields.length, append]);

    const handleFormSubmit: SubmitHandler<PlanFormData> = async (
        formData: PlanFormData
    ) => {
        try {
            setIsSubmitting(true);
            if (onSubmit) {
                await onSubmit(formData);

                if (mode === "create") {
                    reset();
                    handleToggle(false);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = (isOn: boolean) => {
        setValue("application_access", isOn);
    };

    const isLoading = isFormSubmitting || isSubmitting || externalLoading;
    return (
        <div className="space-y-6 bg-primary-200 rounded-md p-3 lg:p-6 shadow-lg shadow-gray-950 border-1 border-gray-800 w-full">
            <form
                className="space-y-4"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <CustomInput
                    name="name"
                    control={control}
                    label="Nombre"
                    type="text"
                    error={errors.name}
                    icon={<IoFlash />}
                    placeholder="Plan básico"
                />
                <div className="w-auto h-[.5px] mx-4 bg-gray-700" />

                {/* Beneficios dinámicos */}
                <div className="p-2 grid lg:flex lg:gap-4 items-center">
                    <div className="flex gap-4">
                        <label className="text-sm font-medium  flex items-center gap-2">
                            <MdDiscount />
                            Beneficios
                        </label>
                        <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            className="w-20 h-8"
                            disabled={fields.length === 4}
                            onClick={() => append("")}
                        >
                            + Agregar
                        </Button>
                    </div>
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {fields.map((field, idx) => (
                            <div
                                key={field.id}
                                className="flex items-center gap-2"
                            >
                                <CustomInput
                                    name={`benefits.${idx}` as const}
                                    control={control}
                                    label=""
                                    type="text"
                                    placeholder={`Beneficio #${idx + 1}`}
                                    error={errors.benefits?.[idx]}
                                />
                                <button
                                    type="button"
                                    className=" px-2 rounded bg-red-700 text-white text-xs hover:bg-red-800"
                                    onClick={() => remove(idx)}
                                    disabled={fields.length === 1}
                                    title="Eliminar beneficio"
                                >
                                    –
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-auto h-[.5px] mx-4 bg-gray-700" />

                <CustomInput
                    name="description"
                    control={control}
                    label="Descripción "
                    type="textarea"
                    error={errors.description}
                    icon={<RiNewspaperLine />}
                    placeholder="Plan de 15 días básico para acceso al gimnasio...."
                />
                <div className="w-auto h-[.5px] mx-4 bg-gray-700" />

                <div className="grid grid-cols-2 gap-4 ">
                    <CustomInput
                        name="price"
                        control={control}
                        label="Precio"
                        type="number"
                        error={errors.price}
                        icon={<RiMoneyDollarCircleFill />}
                    />

                    <CustomInput
                        name="duration_days"
                        control={control}
                        label="Duración días "
                        type="number"
                        error={errors.duration_days}
                        icon={<GiDuration />}
                    />
                </div>

                <div className="w-auto h-[.5px] mx-4 bg-gray-700" />
                <div className="lg:flex px-2 justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <HiDevicePhoneMobile className="" />
                        <p className="text-sm font-medium lg:pr-4 max-w-24">
                            Gestión de rutinas
                        </p>
                        <ToggleButton
                            onToggle={handleToggle}
                            initialState={watch("application_access")}
                        />
                    </div>
                    <p className="text-xs text-gray-400 p-2">
                        ** Este campó es para seleccionar si el plan otorga
                        acceso a la gestión de rutinas
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
    );
};
