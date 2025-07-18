import React, { useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    iconTitle: React.ReactNode;
    children: React.ReactNode;
    closeOnOutsideClick?: boolean;
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    iconTitle,
    children,
    closeOnOutsideClick = true,
}: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeOnOutsideClick ? onClose : undefined}
        >
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>

            {/* Contenedor del modal */}
            <div
                className="m-10 relative z-10 bg-slate-800 px-4 py-2 rounded-xl shadow-xl w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1 border-1 border-gray-600 rounded-md">
                            {iconTitle}
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-white">
                                {title}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-600 hover:text-red-600 text-2xl transition-all duration-200 ease-out "
                    >
                        &times;
                    </button>
                </div>
                <div className="w-auto h-[.5px]  bg-gray-500" />
                <div className="text-gray-800">{children}</div>
            </div>
        </div>
    );
};
