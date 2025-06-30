import { Navigate, Outlet } from "react-router";
import useAuth from "../../lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { SideBar } from "../organisms";
import { Toaster } from "sonner";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout() {
    const { isAuthenticated } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [active, setActive] = useState(false);

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

    const handleNavBar = () => {
        setActive((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-primary-100 flex ">
            {/* Sidebar */}
            <div
                className={`fixed z-50 w-64 h-screen transition-all duration-200 ease-in-out ${
                    active ? "left-0" : "-left-full"
                } lg:left-0`}
            >
                <SideBar />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-screen overflow-y-auto pl-0 lg:ml-66 ">
                <div className="p-6 pt-12 lg:p-6 w-full">
                    <button
                        onClick={handleNavBar}
                        className={`fixed bottom-2 bg-secondary-200 ${
                            active ? "left-54" : "left-4"
                        } z-110 lg:hidden p-2 rounded-full shadow-2xl shadow-gray-800 bg-primary-500  hover:bg-primary-600 transition-all duration-200 `}
                        aria-label="Toggle navigation"
                    >
                        {active ? (
                            <FiX className="text-2xl  text-white" />
                        ) : (
                            <FiMenu className="text-2xl   text-white" />
                        )}
                    </button>
                    <Outlet />
                </div>
            </div>

            <Toaster closeButton richColors position="top-right" />
        </div>
    );
}
