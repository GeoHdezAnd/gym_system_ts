import { Link } from "react-router";
import { DeleteConfirmationDialog } from "../organisms";
import type { PlanProps } from "../../lib/types/types";
import { formatMoney } from "../../lib/utils/formatMoney";
import { RiEdit2Fill } from "react-icons/ri";

export const MobileMembershipCard = ({
    plan,
    handleDeleteMembership,
}: {
    plan: PlanProps;
    handleDeleteMembership: (id: string) => void;
}) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 shadow-lg border border-gray-700">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                <span
                    className={`px-2 text-xs font-semibold rounded-md border ${
                        plan.application_access
                            ? "bg-green-800/60 text-green-400 border-green-700"
                            : "bg-red-800/20 text-red-600 border-red-700"
                    }`}
                >
                    {plan.application_access ? "SI" : "NO"} App
                </span>
            </div>

            <div className="mt-2 text-sm text-gray-300">
                <p className="line-clamp-2">{plan.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                    <p className="text-gray-400">Precio:</p>
                    <p className="font-medium">
                        {formatMoney.format(plan.price)}
                    </p>
                </div>
                <div>
                    <p className="text-gray-400">Duración:</p>
                    <p className="font-medium">{plan.duration_days} días</p>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-gray-400 mb-1">Beneficios:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                    {plan.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Link
                    to={`/dashboard/membership/${plan.id}/edit`}
                    className="p-2 text-yellow-400 border border-yellow-400 rounded-md"
                >
                    <RiEdit2Fill size={16} />
                </Link>
                <DeleteConfirmationDialog
                    fild={`¿Eliminar ${plan.name}?`}
                    onConfirm={() => handleDeleteMembership(plan.id)}
                />
            </div>
        </div>
    );
};
