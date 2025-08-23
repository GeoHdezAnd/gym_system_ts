import api from "../lib/config/axios";
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

export async function getAllWorksoutByRelationId(
    relationId: string
): Promise<TWorkOutResponse[] | []> {
    const { data } = await api.get(`/member-trainer/workout-all/${relationId}`);
    return data;
}
