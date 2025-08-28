import api from "../lib/config/axios";
import type { AdminProps } from "../lib/types/types";

export type AdminRequest = {
    name: string;
    last_name: string;
    email: string;
    phone: string;
    access_level: string;
};

export async function getAllAdmins() {
    const { data } = await api.get("/admin");
    return data;
}

export async function getAdminById(id: string): Promise<AdminProps> {
    const { data } = await api.get(`/admin/${id}`);
    return data;
}

export async function updateAdmin(input: AdminRequest, id: string) {
    const { data } = await api.put(`/admin/${id}`, input);
    return data;
}

export async function deleteAdmin(adminId: string) {
    const { data } = await api.delete(`/admin/${adminId}`);
    return data;
}
