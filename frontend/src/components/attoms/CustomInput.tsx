import { useState } from "react";
import {
    Controller,
    type Control,
    type FieldError,
    type FieldValues,
    type Path,
} from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface Props<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    type?:
        | "text"
        | "password"
        | "email"
        | "tel"
        | "number"
        | "textarea"
        | "select"
        | "date"
        | "time";
    error?: FieldError;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    options?: Option[]; // Para selects
    rows?: number; // Para textarea
    pattern?: string; // Para validación con regex
    patternMessage?: string; // Mensaje de error para el patrón
    icon?: React.ReactNode; // New prop for icon
    min?: string;
}

export const CustomInput = <T extends FieldValues>({
    name,
    control,
    label,
    type = "text",
    error,
    placeholder,
    maxLength,
    minLength,
    options,
    rows = 3,
    icon,
    min,
}: Props<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determinar el tipo de input real a mostrar
    const getInputType = () => {
        if (type === "password") {
            return showPassword ? "text" : "password";
        }
        return type === "tel" ? "text" : type; // Mostrar 'text' para tel para mejor control
    };

    return (
        <div className="form-group space-y-2 ">
            {icon ? (
                <div className="lg:flex  space-y-2 items-center justify-between gap-2 px-2 py-1">
                    <div className="flex gap-2 items-center ">
                        {icon}
                        <label
                            htmlFor={name}
                            className="text-sm font-medium min-w-[100px]"
                        >
                            {label}
                        </label>
                    </div>

                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => {
                            if (type === "select") {
                                return (
                                    <select
                                        id={name}
                                        className={`flex w-full border text-sm   ${
                                            error
                                                ? "border-red-500"
                                                : "border-gray-600"
                                        } rounded p-1 transform duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        {...field}
                                    >
                                        <option value="">
                                            {placeholder ||
                                                "Seleccione una opción"}
                                        </option>
                                        {options?.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                );
                            }

                            if (type === "textarea") {
                                return (
                                    <textarea
                                        id={name}
                                        className={`flex-1 border text-sm w-full ${
                                            error
                                                ? "border-red-500"
                                                : "border-gray-600"
                                        } rounded p-2 transform duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        rows={rows}
                                        maxLength={maxLength}
                                        placeholder={placeholder}
                                        {...field}
                                    />
                                );
                            }

                            return (
                                <div className="relative flex-1">
                                    <input
                                        className={`w-full border text-sm ${
                                            error
                                                ? "border-red-500"
                                                : "border-gray-600"
                                        } rounded px-3 py-1 transform duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        id={name}
                                        type={getInputType()}
                                        placeholder={placeholder}
                                        autoComplete="off"
                                        maxLength={maxLength}
                                        minLength={minLength}
                                        inputMode={
                                            type === "tel"
                                                ? "tel"
                                                : type === "number"
                                                ? "numeric"
                                                : undefined
                                        }
                                        {...field}
                                        onChange={(e) => {
                                            if (type === "number") {
                                                field.onChange(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value)
                                                );
                                            } else {
                                                field.onChange(e);
                                            }
                                        }}
                                    />
                                    {type === "password" && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeOffIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        }}
                    />
                </div>
            ) : (
                <>
                    <div className="relative ">
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => {
                                if (type === "select") {
                                    return (
                                        <select
                                            id={name}
                                            className={`w-full px-3 py-1 border text-sm bg-gray-900 ${
                                                error
                                                    ? "border-red-500"
                                                    : "border-gray-500"
                                            }  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                            {...field}
                                        >
                                            <option value="">
                                                {placeholder ||
                                                    "Seleccione una opción"}
                                            </option>
                                            {options?.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    );
                                }

                                if (type === "textarea") {
                                    return (
                                        <textarea
                                            id={name}
                                            className={`w-full p-3  text-md border ${
                                                error
                                                    ? "border-red-500"
                                                    : "border-gray-500"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                            rows={rows}
                                            placeholder={placeholder}
                                            {...field}
                                        />
                                    );
                                }

                                return (
                                    <input
                                        className={`w-full px-3 py-1 text-md ${
                                            type === "password" ? "pr-10" : ""
                                        } border ${
                                            error
                                                ? "border-red-500"
                                                : "border-gray-500"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white`}
                                        id={name}
                                        type={getInputType()}
                                        placeholder={placeholder}
                                        autoComplete="off"
                                        maxLength={maxLength}
                                        minLength={minLength}
                                        min={min}
                                        inputMode={
                                            type === "tel"
                                                ? "tel"
                                                : type === "number"
                                                ? "numeric"
                                                : undefined
                                        }
                                        {...field}
                                    />
                                );
                            }}
                        />

                        {type === "password" && (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeIcon className="h-5 w-5" />
                                ) : (
                                    <EyeOffIcon className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>
                </>
            )}

            {error && <p className=" text-xs text-red-500">{error.message}</p>}
        </div>
    );
};

// Componentes para contraseña
const EyeIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
    </svg>
);
