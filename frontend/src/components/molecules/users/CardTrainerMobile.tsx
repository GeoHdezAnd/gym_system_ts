import { CiPhone } from "react-icons/ci";
import { TbAccessibleFilled } from "react-icons/tb";
import type { TrainerProps } from "../../../lib/types/types";
import { formatPhone } from "../../../lib/utils/formatInfo";
import { IoIdCardOutline } from "react-icons/io5";
import { MdSportsGymnastics } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { DeleteConfirmationDialog } from "../../organisms";
import { Link } from "react-router";

type CardTrainerMovilProps = {
    trainer: TrainerProps;
    onDelete: (userId: string) => void;
};

export const CardTrainerMobile = ({
    trainer,
    onDelete,
}: CardTrainerMovilProps) => {
    return (
        <div
            key={trainer.id}
            className="bg-gray-800/50 p-4 rounded-lg border-1 border-gray-600"
        >
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 font-bold ring-2 ring-secondary-200">
                        {trainer.name.charAt(0)}
                        {trainer.last_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">
                            {trainer.name} {trainer.last_name}
                        </p>
                        <p className="text-gray-300 text-sm">{trainer.email}</p>
                    </div>
                </div>
            </div>
            <div className="my-2 grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                    <p className="text-gray-400 flex items-center gap-1">
                        <CiPhone /> Teléfono
                    </p>
                    <p>{formatPhone(trainer.phone)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400 flex items-center gap-1">
                        <IoIdCardOutline /> Cuenta
                    </p>
                    <span
                        className={`px-2 inline-flex text-xs leading-2.5 font-semibold rounded-md border p-2 ${
                            trainer.confirmed
                                ? "bg-green-800/60 backdrop-blur-2xl text-green-400 border-green-700 after:content-[''] after:block after:w-1 after:h-1 after:bg-green-400 after:rounded-full after:ml-1.5 after:mt-0.5"
                                : "bg-red-800/20 backdrop-blur-2xl text-red-600 border-red-700 after:content-[''] after:block after:w-1 after:h-1 after:bg-red-600 after:rounded-full after:ml-1.5 after:mt-0.5"
                        }`}
                    >
                        {trainer.confirmed ? "Confirmada" : "Pendiente"}
                    </span>
                </div>
            </div>
            <div className="my-1 text-sm">
                <p className="text-gray-400 flex items-center gap-1">
                    <TbAccessibleFilled /> Biografia
                </p>
                <p>{trainer.profile.bio}</p>
            </div>
            <div>
                <p className="text-gray-400 flex items-center gap-1">
                    <MdSportsGymnastics /> Habilidades
                </p>
                <div className="flex gap-3">
                    {trainer.profile.skills.map((skill, index) => (
                        <p key={index}>{skill}</p>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Link
                    to={`/dashboard/user/trainer/${trainer.id}/edit`}
                    className="px-2 text-yellow-400 flex hover:bg-amber-400/70 border border-yellow-400 rounded-md"
                >
                    <RiEdit2Fill className="m-auto" />
                </Link>
                <DeleteConfirmationDialog
                    fild={`Usuario: ${trainer.name} ${trainer.last_name}`}
                    onConfirm={() => onDelete(trainer.id)}
                />
            </div>
        </div>
    );
};
