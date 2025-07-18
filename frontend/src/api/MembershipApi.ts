import api from "../lib/config/axios";
import type { PlanFormData } from "../lib/schemas/plan";

export async function getMemberships() {
    const { data } = await api.get("plan");
    return data || [];
}

export async function getMembershipId(id: string) {
    const { data } = await api.get(`plan/${id}`);
    return data;
}

export async function updateMembership(id: string, membership: PlanFormData) {
    const { data } = await api.put(`/plan/${id}`, membership);
    return data;
}

export async function deleteMembership(id: string) {
    const { data } = await api.delete(`plan/${id}`);
    return data;
}
