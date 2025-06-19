import clsx from "clsx";

interface ErrorMessageProps {
    message: string;
    error?: Error;
    className?: string;
}

export const ErrorMessage = ({
    message,
    error,
    className,
}: ErrorMessageProps) => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
        <div className={clsx("rounded-md bg-red-50 p-4", className)}>
            <div className="flex">
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        {message}
                    </h3>
                    {error && (
                        <div className="mt-2 text-sm text-red-700">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
