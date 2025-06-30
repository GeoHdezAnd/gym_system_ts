import {
    RiCollageFill,
    RiUserFill,
    RiSettingsFill,
    RiUserAddFill,
    RiShieldUserLine,
} from "react-icons/ri";
import { TbUsers } from "react-icons/tb";
import { NavItem } from "../attoms/NavItem";

export function SideBar() {
    const navItems = [
        { to: "", icon: RiCollageFill, label: "Dashboard", end: true },
        {
            to: "users",
            icon: RiUserFill,
            label: "Usuarios",
            subItems: [
                {
                    to: "users/add",
                    label: "Agregar usuario",
                    icon: RiUserAddFill,
                },
                {
                    to: "users/customer",
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
        { to: "settings", icon: RiSettingsFill, label: "Configuración" },
    ];

    return (
        <aside className="flex flex-col  h-full bg-primary-100 text-white transition-all duration-300  shadow-2xl shadow-black rounded-r-md border-r-[1px] border-gray-900  select-none">
            <div className="flex py-4  items-center justify-center">
                <img src="/logo.png" alt="logo" width={70} />
                <p className="font-medium text-xl ">Kings Layer</p>
            </div>

            <nav className="flex-1 flex flex-col gap-1 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        end={item.end}
                        subItems={item.subItems}
                    />
                ))}
            </nav>
        </aside>
    );
}
