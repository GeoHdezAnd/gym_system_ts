import {
    AdminWithUserDto,
    IAdminWithUserDto,
} from "../../domain/dtos/admin.dto";
import { Admin } from "../../domain/entities";
import { AdminRepository } from "../../domain/interfaces";
import { AdminModel, UserModel } from "../models";

export class SequelizeAdminRepository implements AdminRepository {
    async create(admin: Admin): Promise<Admin> {
        const adminModel = await AdminModel.create({
            user_id: admin.user_id!,
            access_level: admin.access_level,
        });

        return new Admin({
            id: adminModel.id,
            user_id: adminModel.user_id,
            access_level: adminModel.access_level,
        });
    }

    async getAll(): Promise<IAdminWithUserDto[] | []> {
        const { rows } = await AdminModel.findAndCountAll({
            include: [
                {
                    association: "user_account",
                    required: true,
                    where: { deleted: false },
                    attributes: [
                        "id",
                        "name",
                        "last_name",
                        "email",
                        "phone",
                        "confirmed",
                    ],
                },
            ],
            order: [
                [
                    { model: UserModel, as: "user_account" },
                    "created_at",
                    "DESC",
                ],
            ],
        });
        const admins = rows.map((admin: AdminModel) =>
            AdminWithUserDto.fromSequelizeModels(admin.user_account!, {
                id: admin.id!,
                access_level: admin.access_level,
            })
        );

        return admins || [];
    }

    async findByUserId(user_id: string): Promise<IAdminWithUserDto | null> {
        const admin = await AdminModel.findOne({
            where: { user_id },
            include: [
                {
                    association: "user_account",
                    required: true,
                    include: [
                        {
                            association: "role",
                            where: { name: "admin" },
                            attributes: [],
                        },
                    ],
                    attributes: [
                        "id",
                        "name",
                        "last_name",
                        "email",
                        "phone",
                        "confirmed",
                    ],
                },
            ],
        });

        if (!admin) {
            return null;
        }

        return AdminWithUserDto.fromSequelizeModels(admin.user_account!, {
            id: admin.id!,
            access_level: admin.access_level,
        });
    }

    async save(access_level: string, user_id: string): Promise<void> {
        const adminProfile = await AdminModel.findOne({
            where: { user_id },
        });

        await adminProfile?.update({
            access_level: access_level,
        });
    }
}
