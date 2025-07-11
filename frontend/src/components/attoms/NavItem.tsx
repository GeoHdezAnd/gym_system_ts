import { NavLink } from "react-router";
import clsx from "clsx";
import { type IconType } from "react-icons";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface NavItemProps {
    to: string;
    icon: IconType;
    label: string;
    end?: boolean;
    subItems?: Array<{ to: string; label: string; icon?: IconType }>;
    isExpanded?: boolean;
    onExpand?: () => void;
}

export function NavItem({
    to,
    icon: Icon,
    label,
    end = false,
    subItems,
    isExpanded = false,
    onExpand,
}: NavItemProps) {
    return (
        <div className="flex flex-col cursor-pointer">
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                    clsx(
                        "flex text-sm rounded-md items-center pl-8 py-2 mx-4 gap-6 transform duration-200 ",
                        isActive && !subItems
                            ? "text-white border-l-4  bg-gray-100/5 border-l-secondary-100"
                            : "text-gray-400  hover:bg-gray-100/5",
                        subItems && "justify-between pr-4",
                        isActive && "text-white bg-gray-100/5"
                    )
                }
                onClick={(e) => {
                    if (subItems) {
                        e.preventDefault();
                        onExpand?.();
                    }
                }}
            >
                {({ isActive }) => (
                    <>
                        <div className="flex items-center gap-6">
                            <Icon
                                className={clsx(
                                    "text-lg",
                                    isActive && "text-secondary-200"
                                )}
                            />
                            <span>{label}</span>
                        </div>
                        {subItems && (
                            <span className="text-sm">
                                {isExpanded ? (
                                    <FiChevronDown
                                        className={`font-bold ${
                                            isActive && "text-secondary-200"
                                        }`}
                                    />
                                ) : (
                                    <FiChevronRight
                                        className={` font-bold ${
                                            isActive && "text-secondary-200"
                                        }`}
                                    />
                                )}
                            </span>
                        )}
                    </>
                )}
            </NavLink>

            {subItems && isExpanded && (
                <div className="ml-8 mx-4 space-y-1 mt-1 flex flex-col">
                    {subItems.map((subItem) => (
                        <NavLink
                            key={subItem.to}
                            to={subItem.to}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center pl-6 p-2 rounded-md gap-4 text-sm transform duration-150 ease-in",
                                    isActive
                                        ? "text-white   bg-gray-100/5 border-l-4 border-secondary-100"
                                        : "text-gray-400  hover:bg-gray-100/5"
                                )
                            }
                        >
                            {subItem.icon && (
                                <subItem.icon
                                    className={clsx("text-lg opacity-70")}
                                />
                            )}
                            <span>{subItem.label}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}
