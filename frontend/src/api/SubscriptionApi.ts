import api from "../lib/config/axios";

export async function makeSubscriptionMember(userId: string, planId: string) {
    const { data } = await api.post("subscription", { userId, planId });
    return data || {};
}

export async function getSubscriptionsByUserId(userId: string) {
    const { data } = await api.get(`subscription/${userId}`);
    return data || [];
}
