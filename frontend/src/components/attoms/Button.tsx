import { type ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    disabled = false,
    onClick,
    fullWidth = false,
    loading = false,
}: ButtonProps) => {
    const baseClasses =
        "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";

    const sizeClasses = {
        sm: "py-1.5 px-3 text-sm",
        md: "py-2 px-4 text-base",
        lg: "py-3 px-6 text-lg",
    };

    const variantClasses = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md",
        secondary:
            "bg-gray-700 hover:bg-gray-600 text-white shadow hover:shadow-md",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md",
        ghost: "bg-transparent hover:bg-gray-800/50 text-gray-300",
        outline:
            "border border-gray-600 hover:border-gray-500 bg-transparent text-gray-300 hover:bg-gray-800/30",
    };

    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
        <button
            type={type}
            className={clsx(
                baseClasses,
                sizeClasses[size],
                variantClasses[variant],
                fullWidth && "w-full",
                disabled && disabledClasses,
                className
            )}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};
