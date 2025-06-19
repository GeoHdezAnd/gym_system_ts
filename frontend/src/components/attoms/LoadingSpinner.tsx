import clsx from "clsx";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const LoadingSpinner = ({
    size = "md",
    className,
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div
            className={clsx(
                "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
                sizeClasses[size],
                className
            )}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};
