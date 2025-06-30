import { Outlet } from "react-router";
import { Toaster } from "sonner";

const AuthLayout = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-200 flex flex-col items-center justify-center p-4 sm:p-6">
                {/* Contenedor principal responsivo */}
                <div className="w-full max-w-md mx-auto">
                    {/* Contenedor de formulario con efecto vidrio */}
                    <div className="backdrop-blur-[12px] bg-black/40 border border-gray-600/50 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-gray-500/70">
                        {/* Contenido responsivo */}
                        <div className="p-6 sm:p-8 md:p-10 space-y-6 text-white text-center">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            {/* Notificaciones - posición ajustada para móviles */}
            <Toaster closeButton richColors position="top-right" />
        </>
    );
};

export default AuthLayout;
