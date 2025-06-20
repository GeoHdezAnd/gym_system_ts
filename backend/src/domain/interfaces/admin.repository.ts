import { Admin } from "../entities";

export interface AdminRepository {
    create(admin: Admin): Promise<Admin>;
    findByUserId(user_id: string): Promise<Admin | null>;
}
