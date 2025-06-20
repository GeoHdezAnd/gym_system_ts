import { Admin } from "../../domain/entities";
import { AdminRepository } from "../../domain/interfaces";
import { AdminModel } from "../models";

export class SequelizeAdminRepository implements AdminRepository {
    async create(admin: Admin): Promise<Admin> {
        const adminModel = await AdminModel.create({
            user_id: admin.user_id,
            access_level: admin.access_level,
        });

        return new Admin({
            id: adminModel.id,
            user_id: adminModel.user_id,
            access_level: adminModel.access_level,
        });
    }

    async findByUserId(user_id: string): Promise<Admin | null> {
        const adminModel = await AdminModel.findOne({
            where: { user_id },
        });

        if (!adminModel) {
            return null;
        }

        return new Admin({
            id: adminModel.id,
            user_id: adminModel.user_id,
            access_level: adminModel.access_level,
        });
    }
}
