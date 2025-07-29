import api from "../lib/config/axios";
import type { TrainerFormData } from "../lib/schemas/users";

export async function getTrainers() {
    const { data } = await api.get("/trainer/");
    return data || [];
}

export async function getTrainerById(id: string) {
    const { data } = await api.get(`/trainer/${id}`);
    return data;
}

export async function updateTrainer(id: string, trainer: TrainerFormData) {
    const { data } = await api.put(`/trainer/${id}`, trainer);
    return data;
}

export async function deleteTrainer(userId: string) {
    const { data } = await api.delete(`/trainer/${userId}`);

    return data;
}
