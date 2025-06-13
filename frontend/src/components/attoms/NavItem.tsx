import { NavLink } from "react-router";
import clsx from "clsx";
import { type IconType } from "react-icons";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface NavItemProps {
    to: string;
    icon: IconType;
    label: string;
    end?: boolean;
    subItems?: Array<{ to: string; label: string; icon?: IconType }>;
}

export function NavItem({
    to,
    icon: Icon,
    label,
    end = false,
    subItems,
}: NavItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col">
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                    clsx(
                        "flex items-center pl-10 p-3 gap-6 transform duration-200 ",
                        isActive && !subItems
                            ? "text-white font-bold border-l-4  bg-secondary-100/50 border-l-secondary-100"
                            : "text-gray-400 font-semibold hover:bg-secondary-100/40",
                        subItems && "justify-between pr-4",
                        isActive && "text-white"
                    )
                }
                onClick={(e) => {
                    if (subItems) {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
            >
                {({ isActive }) => (
                    <>
                        <div className="flex items-center gap-6">
                            <Icon
                                className={clsx(
                                    "text-lg",
                                    isActive ? "text-secondary-200" : ""
                                )}
                            />
                            <span>{label}</span>
                        </div>
                        {subItems && (
                            <span className="text-sm">
                                {isExpanded ? (
                                    <FiChevronDown />
                                ) : (
                                    <FiChevronRight />
                                )}
                            </span>
                        )}
                    </>
                )}
            </NavLink>

            {subItems && isExpanded && (
                <div className="ml-8 flex flex-col">
                    {subItems.map((subItem) => (
                        <NavLink
                            key={subItem.to}
                            to={subItem.to}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center pl-6 p-3 gap-4 text-sm transform duration-150 ease-in",
                                    isActive
                                        ? "text-white font-bold  bg-secondary-100/50 border-l-4 border-secondary-100"
                                        : "text-gray-400 font-medium hover:bg-secondary-100/20"
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
