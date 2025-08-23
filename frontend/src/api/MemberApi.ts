import type { MemberAddSchema } from "../components/organisms/admin";
import api from "../lib/config/axios";
import type { MemberProps } from "../lib/types/types";

type PropsGet = {
    page?: number;
    limit?: number;
    search?: string;
};

export async function getMembers(params: PropsGet) {
    const { data } = await api.get("member", {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search || undefined,
        },
    });
    return data || { members: [], total: 0, pages: 1, currentPage: 1 };
}

export async function getMemberByID(id: string): Promise<MemberProps> {
    const { data } = await api.get(`/member/${id}`);
    return data;
}

export async function updateMember(id: string, user: MemberAddSchema) {
    const { data } = await api.put(`/member/${id}`, user);
    return data;
}

export async function deleteMember(userId: string) {
    const { data } = await api.delete(`/member/${userId}`);

    return data;
}

export async function deleteBatchMembers(userIds: string[]) {
    const { data } = await api.delete("/member/batch-delete", {
        data: { userIds },
    });
    return data;
}
