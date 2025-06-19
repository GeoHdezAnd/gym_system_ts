import api from "../lib/config/axios";
import { handleApiError } from "../lib/utils/handleAPIError";

export async function getMembers() {
    try {
        const { data } = await api.get("member");
        return data || [];
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}
