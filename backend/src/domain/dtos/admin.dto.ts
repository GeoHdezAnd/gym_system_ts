import { AdminModel } from "../../infrastructure/models";
import { AdminProps, UserProps } from "../entities";

export interface IAdminWithUserDto {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;
    profile: {
        id: string;
        access_level: string;
    };
}

export class AdminWithUserDto {
    public static fromSequelizeModels(
        userModel: UserProps,
        adminModel: AdminProps
    ): IAdminWithUserDto {
        if (!adminModel || !userModel) {
            throw new Error("Models cannot be null");
        }
        return {
            id: userModel.id!,
            name: userModel.name,
            last_name: userModel.last_name,
            email: userModel.email,
            phone: userModel.phone,
            confirmed: userModel.confirmed!,
            profile: {
                id: adminModel.id!,
                access_level: adminModel.access_level,
            },
        };
    }
}
