import {
    RiCollageFill,
    RiUserFill,
    RiSettingsFill,
    RiUserAddFill,
    RiShieldUserLine,
    RiPantoneFill,
    RiAddCircleLine,
    RiAppsFill,
} from "react-icons/ri";
import { TbUsers } from "react-icons/tb";
import { NavItem } from "../attoms/NavItem";
import { useState } from "react";

export function SideBar() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const navItems = [
        { to: "", icon: RiCollageFill, label: "Dashboard", end: true },
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
                    to: "users/roles",
                    label: "Administrar roles",
                    icon: RiShieldUserLine,
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
        { to: "settings", icon: RiSettingsFill, label: "Configuración" },
    ];

    return (
        <aside className="flex flex-col  h-full bg-primary-100 text-white transition-all duration-300  shadow-2xl shadow-black rounded-r-md border-r-[1px] border-gray-900  select-none">
            <div className="flex py-4  items-center justify-center">
                <img src="/logo.png" alt="logo" width={70} />
                <p className="font-medium text-xl ">Kings Layer</p>
            </div>

            <nav className="flex-1 flex flex-col gap-1 mt-4 overflow-y-auto">
                {navItems.map((item, idx) => (
                    <NavItem
                        key={item.to}
                        {...item}
                        isExpanded={expandedIndex === idx}
                        onExpand={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    />
                ))}
            </nav>
        </aside>
    );
}
