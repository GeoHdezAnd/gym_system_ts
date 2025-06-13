import { Admin } from "../entities";

export interface AdminRepository {
    create(admin: Admin): Promise<Admin>;
    findByUserId(userId: string): Promise<Admin | null>;
}
