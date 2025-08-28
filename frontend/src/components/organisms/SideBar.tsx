import {
    RiUserFill,
    RiUserAddFill,
    RiPantoneFill,
    RiAddCircleLine,
    RiAppsFill,
} from "react-icons/ri";
import { GiMuscleUp } from "react-icons/gi";
import { TbUsers } from "react-icons/tb";
import { LiaUsersCogSolid } from "react-icons/lia";
import { NavItem } from "../attoms/NavItem";
import { ImExit } from "react-icons/im";
import { useState } from "react";
import useAuth from "../../lib/hooks/useAuth";

export function SideBar() {
    const { logOut } = useAuth();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const navItems = [
        {
            to: "user",
            icon: RiUserFill,
            label: "Usuarios",
            subItems: [
                {
                    to: "user/add",
                    label: "Agregar usuario",
                    icon: RiUserAddFill,
                },
                {
                    to: "user/customer/all",
                    label: "Clientes",
                    icon: TbUsers,
                },
                {
                    to: "user/trainer/all",
                    label: "Entrenadores",
                    icon: GiMuscleUp,
                },
                {
                    to: "user/admin/all",
                    label: "Administradores",
                    icon: LiaUsersCogSolid,
                },
            ],
        },
        {
            to: "membership",
            icon: RiPantoneFill,
            label: "Membresias",
            subItems: [
                {
                    to: "membership/add",
                    label: "Agregar",
                    icon: RiAddCircleLine,
                },
                {
                    to: "membership/all",
                    label: "Ver todas",
                    icon: RiAppsFill,
                },
            ],
        },
    ];

    return (
        <aside className="flex flex-col  h-full bg-primary-100 text-white transition-all duration-300  shadow-2xl shadow-black rounded-r-md border-r-[1px] border-gray-900  select-none">
            <div className="flex py-4  items-center justify-center">
                <img src="/logo.png" alt="logo" width={70} />
                <p className="font-medium text-xl ">Kings Layer</p>
            </div>

            <nav className="h-full flex flex-col justify-between my-4">
                <div className="flex flex-col gap-1 mt-4">
                    {navItems.map((item, idx) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            isExpanded={expandedIndex === idx}
                            onExpand={() =>
                                setExpandedIndex(
                                    expandedIndex === idx ? null : idx
                                )
                            }
                        />
                    ))}
                </div>
                <div className="grid gap-2">
                    <div className="w-auto h-[.5px] mx-4 bg-gray-700" />

                    <button
                        type="button"
                        className="cursor-pointer flex text-sm rounded-md items-center pl-8 py-2 mx-4 gap-6 transform duration-20 bg-red-800/20 hover:bg-red-800/30 text-red-600 border-red-700"
                        onClick={logOut}
                    >
                        <ImExit />
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </aside>
    );
}
