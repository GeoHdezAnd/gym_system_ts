import api from "../lib/config/axios";
import type { WorkOutData } from "../lib/schemas/training";
import type {
    TRelationMemberTrainer,
    TWorkOutResponse,
} from "../lib/types/types";

export async function getRelationMemberTrainer(memberId: string) {
    const { data } = await api.get(`/member-trainer/${memberId}`);

    return data;
}

export async function createRelationMemberTrainer(input: {
    memberId: string;
    trainerId: string;
}) {
    const { data } = await api.post("/member-trainer", input);
    return data;
}

export async function updateRelation(input: TRelationMemberTrainer) {
    const { data } = await api.put(`/member-trainer/${input.id!}`, input);
    return data;
}

export async function getAdvisedByTrainerId(trainerId: string) {
    const { data } = await api.get(`/member-trainer/advised/${trainerId}`);
    return data;
}

// Entrenamientos
export async function getAllWorksoutByRelationId(
    relationId: string
): Promise<TWorkOutResponse[] | []> {
    const { data } = await api.get(`/member-trainer/workout-all/${relationId}`);
    return data;
}

export async function getWorkOutById(id: string): Promise<TWorkOutResponse> {
    const { data } = await api.get(`/member-trainer/work-out/${id}`);
    return data;
}

export async function updateWorkOut(id: string, workout: WorkOutData) {
    const { data } = await api.put(`/member-trainer/work-out/${id}`, workout);
    return data;
}

export async function deleteWorkOut(id: string){
    const { data } = await api.delete(`/member-trainer/work-out/${id}`)
    return data;
}