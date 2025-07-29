import { useEffect, useState } from "react";
import useAuth from "../../lib/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export default function ClientLayout() {
    const { isAuthenticated } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCheckingAuth(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isCheckingAuth) {
        return (
            <div className="flex bg-primary-100 items-center justify-center min-h-screen">
                <div className="animate-spin text-amber-50 rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-primary-100 flex">
            <div className="">
                
            </div>
            {/* Contenido principal */}
            <div>
                <Outlet />
            </div>
        </div>
    );
}
