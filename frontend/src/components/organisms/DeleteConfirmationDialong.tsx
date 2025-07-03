import { useState, useRef, useEffect } from "react";
import { PiEraserFill } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../attoms";
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
                        animate={{ opacity: 1, y: 70, x: -30, scale: 1 }}
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
                            <div className="items-center p-3 border-b border-gray-700 bg-gray-900/50">
                                <h3 className="text-sm text-red-400 flex items-center gap-2">
                                    <PiEraserFill />
                                    Confirmar eliminación
                                </h3>
                                
                            </div>

                            {/* Cuerpo */}
                            <div className="p-4 text-center">
                               
                                <p className="text-pretty text-gray-400 py-2 text-sm leading-none">
                                    {fild}
                                </p>

                                {/* Acciones */}
                                <div className="flex justify-end mt-2 gap-2">
                                    <Button
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                        variant="secondary"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onConfirm();
                                        }}
                                        variant="danger"
                                    >
                                        <PiEraserFill />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
