import { CiCalendarDate, CiPhone } from "react-icons/ci";
import type { MemberProps } from "../../../lib/types/types";
import { formatDate, formatPhone } from "../../../lib/utils/formatInfo";
import { RiEdit2Fill } from "react-icons/ri";
import { DeleteConfirmationDialog } from "../../organisms";
import { IoIdCardOutline } from "react-icons/io5";
import { CgGym } from "react-icons/cg";
import { Link } from "react-router";

type CardMemberMovilProps = {
    user: MemberProps;
    onDelete: (userId: string) => void;
    isSelected: boolean;
    onSelect: (userId: string, isChecked: boolean) => void;
};

export const CardMemberMovil = ({
    user,
    onDelete,
    isSelected,
    onSelect,
}: CardMemberMovilProps) => {
    return (
        <div key={user.id} className="bg-gray-800/50 border-1 border-gray-600 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <img
                        src={
                            user.profile.gender === "M"
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
                        {user.profile.born_date
                            ? formatDate(user.profile.born_date)
                            : "N/A"}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400 flex items-center gap-1">
                        <IoIdCardOutline /> Cuenta
                    </p>
                    <span
                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                            user.confirmed
                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                        }`}
                    >
                        {user.confirmed ? "Confirmada" : "Pendiente"}
                    </span>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400 flex items-center gap-1">
                        <CgGym /> Suscripción
                    </p>
                    <Link
                        to={`/dashboard/user/customer/${user.id}/subscription`}
                        className={`px-2 cursor-pointer inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                            user.profile.status === "active"
                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                        }`}
                    >
                        {user.profile.status || "pending"}
                    </Link>
                </div>
                {/* Agregar más campos aquí si es necesario... */}
            </div>

            <div className="mt-3 flex justify-end gap-2">
                <Link
                    to={`/dashboard/user/customer/${user.id}/subscription`}
                    className="px-2 text-yellow-400 flex hover:bg-amber-400/70 border border-yellow-400 rounded-md"
                >
                    <RiEdit2Fill className="m-auto" />
                </Link>
                <DeleteConfirmationDialog
                    fild={`Usuario: ${user.name} ${user.last_name}`}
                    onConfirm={() => onDelete(user.id)}
                />
            </div>
        </div>
    );
};
