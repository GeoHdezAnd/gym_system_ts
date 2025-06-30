import { useState, useRef, useEffect } from "react";
import { PiEraserFill, PiX } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
type Props = {
    fild: string;
    onConfirm: () => void;
};

export const DeleteConfirmationDialog = ({ fild, onConfirm }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Cierra el diálogo al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dialogRef.current &&
                !dialogRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {/* Botón de eliminar */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 cursor-pointer text-red-400 border border-red-400 rounded-md hover:bg-red-900/30 transition-colors"
            >
                <PiEraserFill className="text-lg" />
            </button>

            {/* Diálogo animado */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dialogRef}
                        initial={{ opacity: 0, y: 50, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 100, x: -30, scale: 1 }}
                        exit={{ opacity: 0, y: 50, x: -10, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="absolute right-0 bottom-full mb-2 z-50 origin-bottom-right"
                    >
                        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden w-64">
                            {/* Encabezado */}
                            <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-900/50">
                                <h3 className="text-sm text-red-400 flex items-center gap-2">
                                    <PiEraserFill />
                                    Confirmar eliminación
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <PiX />
                                </button>
                            </div>

                            {/* Cuerpo */}
                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-300  ">
                                    ¿Está seguro de eliminar el campo?
                                </p>
                                <span className="text-pretty text-sm leading-none">
                                    {fild}
                                </span>

                                {/* Acciones */}
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                        className="px-3 py-1.5 text-sm rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onConfirm();
                                        }}
                                        className="px-3 py-1.5 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 transition-colors"
                                    >
                                        <PiEraserFill />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
