import { Navigate, Outlet } from "react-router";
import useAuth from "../../lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { SideBar } from "../organisms";
import { Toaster } from "sonner";

export default function DashboardLayout() {
    const { isAuthenticated } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        // Simula tiempo de verificación o espera a que se complete la autenticación
        const timer = setTimeout(() => {
            setIsCheckingAuth(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isCheckingAuth) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-primary-100 flex ">
            <SideBar />

            <div className="pl-68 w-full">
                <Outlet />
            </div>
            <Toaster closeButton richColors position="top-right" />
        </div>
    );
}
