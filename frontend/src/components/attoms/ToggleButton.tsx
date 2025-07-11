import { useState } from "react";

type ToggleButtonProps = {
    initialState?: boolean;
    onToggle?: (isOn: boolean) => void;
    size?: "sm" | "md" | "lg";
};

export const ToggleButton = ({
    initialState = false,
    onToggle,
    size = "sm",
}: ToggleButtonProps) => {
    const [isOn, setIsOn] = useState(initialState);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        if (onToggle) {
            onToggle(newState);
        }
    };

    const sizeClasses = {
        sm: "w-12 h-6",
        md: "w-20 h-10",
        lg: "w-24 h-12",
    };

    const knobSizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={`${
                sizeClasses[size]
            } relative rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                isOn ? "bg-green-500" : "bg-red-600"
            }`}
            aria-pressed={isOn}
        >
            <div
                className={`${
                    knobSizeClasses[size]
                } absolute top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isOn ? `translate-x-[calc(140%)]` : "translate-x-1"
                }`}
            />
        </button>
    );
};
