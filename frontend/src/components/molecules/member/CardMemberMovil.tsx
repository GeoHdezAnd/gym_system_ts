import { CiCalendarDate, CiPhone } from "react-icons/ci";
import type { MemberProps } from "../../../lib/types/types";
import { formatDate, formatPhone } from "../../../lib/utils/formatInfo";
import { RiEdit2Fill } from "react-icons/ri";
import { DeleteConfirmationDialog } from "../../organisms";

type CardMemberMovilProps = MemberProps & {
    onDelete: (userId: string) => void;
    isSelected: boolean;
    onSelect: (userId: string, isChecked: boolean) => void;
};

export const CardMemberMovil = ({
    user,
    profile,
    onDelete,
    isSelected,
    onSelect,
}: CardMemberMovilProps) => {
    return (
        <div key={user.id} className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <img
                        src={
                            profile.gender === "M"
                                ? "/male-avatar.png"
                                : "/female-avatar.png"
                        }
                        className="rounded-full w-10 h-10 ring-2 ring-secondary-200"
                        alt="customer-photo"
                    />
                    <div>
                        <p className="font-medium">
                            {user.name} {user.last_name}
                        </p>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(user.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-gray-400 flex items-center gap-1">
                        <CiPhone /> Teléfono
                    </p>
                    <p>{formatPhone(user.phone)}</p>
                </div>
                <div>
                    <p className="text-gray-400 flex items-center gap-1">
                        <CiCalendarDate /> Nacimiento
                    </p>
                    <p>
                        {profile.born_date
                            ? formatDate(profile.born_date)
                            : "N/A"}
                    </p>
                </div>
                {/* Agregar más campos aquí si es necesario... */}
            </div>

            <div className="mt-3 flex justify-end gap-2">
                <button className="p-1 text-yellow-400 hover:bg-amber-400/70 border border-yellow-400 rounded-md">
                    <RiEdit2Fill />
                </button>
                <DeleteConfirmationDialog
                    fild={`Usuario: ${user.name} ${user.last_name}`}
                    onConfirm={() => onDelete(user.id)}
                />
            </div>
        </div>
    );
};
