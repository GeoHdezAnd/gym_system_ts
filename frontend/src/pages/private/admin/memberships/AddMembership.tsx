import { toast } from "sonner";
import { FormPlan } from "../../../../components/organisms/admin";
import type { PlanFormData } from "../../../../lib/schemas/plan";
import api from "../../../../lib/config/axios";
import { handleApiError } from "../../../../lib/utils/handleAPIError";

export default function AddMembership() {
    const onSubmit = (data: PlanFormData) => {
        toast.promise(api.post("/plan", data), {
            loading: "Guardando plan...",
            success: (response) => {
                const { message } = response.data;
                return message;
            },
            error: (error) => {
                return handleApiError(error);
            },
        });
    };
    return (
        <div className="container text-white">
            <div className="mb-4">
                <h1 className="text-2xl font-semibold  ">Agregar un plan</h1>
                <p className="text-gray-500">
                    LLena el formulario y envialo para crear el plan
                </p>
            </div>

            <div className="w-full px-6">
                <FormPlan
                    mode="create"
                    onSubmit={async (data) => {
                        onSubmit(data);
                    }}
                />
            </div>
        </div>
    );
}
