import { MemberModel } from "../../infrastructure/models";
import { UserProps } from "../entities";

export interface IMemberWithUserDto {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;
    profile: {
        id: string;
        gender: string;
        born_date: Date;
        matricula: string;
        status?: string;
    };
}

export class MemberWithUserDto {
    // Método estático para creación desde modelos de Sequelize
    public static fromSequelizeModels(
        memberModel: MemberModel,
        userModel: UserProps,
        subscriptionstatus?: string
    ): IMemberWithUserDto {
        if (!memberModel || !userModel) {
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
                id: memberModel.id,
                gender: memberModel.gender,
                born_date: memberModel.born_date,
                matricula: memberModel.matricula,
                status: subscriptionstatus,
            },
        };
    }
}
