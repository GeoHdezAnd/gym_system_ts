import { Admin } from "../../core/domain/entities";
import { AdminRepository } from "../../core/domain/interfaces";
import { AdminModel } from "../models";

export class SequelizeAdminRepository implements AdminRepository {
    async create(admin: Admin): Promise<Admin> {
        const adminModel = await AdminModel.create({
            userId: admin.userId,
            accessLevel: admin.accessLevel
        });

        return new Admin({
            id: adminModel.id,
            userId: adminModel.userId,
            accessLevel: adminModel.accessLevel
        });
    }

    async findByUserId(userId: string): Promise<Admin | null> {
        const adminModel = await AdminModel.findOne({
            where: { userId }
        });

        if (!adminModel) {
            return null;
        }

        return new Admin({
            id: adminModel.id,
            userId: adminModel.userId,
            accessLevel: adminModel.accessLevel
        });
    }
}