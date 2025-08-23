import { useEffect, useState } from "react";
import useAuth from "../../lib/hooks/useAuth";
import { Navigate, NavLink, Outlet } from "react-router";
import { Toaster } from "sonner";
import clsx from "clsx";
import { IoHomeSharp } from "react-icons/io5";
import { RiAccountCircle2Fill } from "react-icons/ri";
import { FaDumbbell } from "react-icons/fa6";

export default function TrainerLayout() {
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
        <div className="min-h-screen  bg-primary-100 flex">
            <div className="m-auto h-screen flex flex-col min-h-screen min-md:border min-md:border-gray-400 min-md:rounded-md ">
                {/* Contenido principal */}
                <div className="p-3 lg:px-16 flex-1 overflow-auto">
                    <Outlet />
                </div>
                <SideBar />
            </div>
            <Toaster closeButton richColors position="top-right" />
        </div>
    );
}

const SideBar = () => {
    return (
        <div className=" flex px-2 lg:p-0 justify-center  bg-primary-300 w-screen min-md:w-xl min-md:rounded-b-lg">
            <NavLink
                to={"/trainer"}
                end
                className={({ isActive }) =>
                    clsx(
                        "grid gap-1 p-4  text-gray-400 hover:text-gray-200 text-sm",
                        isActive && "text-white"
                    )
                }
            >
                <IoHomeSharp className="text-2xl md:text-xl m-auto" />
                <p>Inicio</p>
            </NavLink>
            <NavLink
                to={"coaching"}
                className={({ isActive }) =>
                    clsx(
                        "grid gap-1 p-4 text-gray-400 hover:text-gray-200 text-sm",
                        isActive && "text-white"
                    )
                }
            >
                <FaDumbbell className="text-2xl md:text-xl m-auto" />
                <p>Asesorados</p>
            </NavLink>
            <NavLink
                to={"profile"}
                className={({ isActive }) =>
                    clsx(
                        "grid gap-1 p-3 text-gray-400 hover:text-gray-200 text-sm",
                        isActive && "text-white"
                    )
                }
            >
                <RiAccountCircle2Fill className="text-2xl md:text-xl m-auto" />
                <p>Cuenta</p>
            </NavLink>
        </div>
    );
};
