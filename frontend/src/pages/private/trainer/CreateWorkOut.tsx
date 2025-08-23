import { IoCloseSharp } from "react-icons/io5";
import { Link, useParams } from "react-router";
import { FormWorkOut } from "../../../components/organisms/clientTrainerApp/FormWorkOut";
import type { WorkOutData } from "../../../lib/schemas/training";
import { toast } from "sonner";
import api from "../../../lib/config/axios";
import { handleApiError } from "../../../lib/utils/handleAPIError";

export default function CreateWorkOut() {
    const { id } = useParams();

    const onSubmit = (data: WorkOutData) => {
        console.log(data)
        toast.promise(api.post("/member-trainer/workout", data), {
            loading: "Guardando rutina...",
            success: (response) => {
                const { message } = response.data;
                return message;
            },
            error: (error) => {
                console.log(error)
                return handleApiError(error);
            },
        });
    };

    return (
        <main className="text-white max-w-md mx-auto grid p-4 lg:p-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
                <Link
                    className="hover:text-pink-800 flex items-center"
                    to={`/trainer/coaching/${id}`}
                >
                    <IoCloseSharp className="text-3xl cursor-pointer" />
                </Link>
                <h1 className="font-semibold text-xl flex-grow text-center">
                    Crear nueva rutina
                </h1>
                <div className="w-8" />
            </div>

            <div className="w-full">
                <FormWorkOut
                    mode="create"
                    onSubmit={async (data) => {
                        onSubmit(data);
                    }}
                />
            </div>
        </main>
    );
}
