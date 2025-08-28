import { IAdminWithUserDto } from "../dtos/admin.dto";
import { Admin } from "../entities";

export interface AdminRepository {
    create(admin: Admin): Promise<Admin>;
    getAll(): Promise<IAdminWithUserDto[] | []>;
    findByUserId(user_id: string): Promise<IAdminWithUserDto | null>;
    save(access_level: string, user_id: string): Promise<void>;
}
