import { MemberProps } from "../../../../domain/entities";

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
    };
}

export class MemberWithUserDto implements IMemberWithUserDto {
    public readonly id: string;
    public readonly name: string;
    public readonly last_name: string;
    public readonly email: string;
    public readonly phone: string;
    public readonly confirmed: boolean;
    public readonly profile: {
        id: string;
        gender: string;
        born_date: Date;
        matricula: string;
    };

    constructor(params: IMemberWithUserDto) {
        // Validaciones básicas
        if (!params.id) throw new Error("User ID is required");
        if (!params.profile?.id) throw new Error("Profile ID is required");

        this.id = params.id;
        this.name = params.name;
        this.last_name = params.last_name;
        this.email = params.email;
        this.phone = params.phone;
        this.confirmed = params.confirmed;
        this.profile = params.profile;
    }

    // Método estático para creación desde modelos de Sequelize
    public static fromSequelizeModels(
        memberModel: any,
        userModel: any
    ): MemberWithUserDto {
        if (!memberModel || !userModel) {
            throw new Error("Models cannot be null");
        }

        return new MemberWithUserDto({
            id: userModel.id,
            name: userModel.name,
            last_name: userModel.last_name,
            email: userModel.email,
            phone: userModel.phone,
            confirmed: userModel.confirmed,
            profile: {
                id: memberModel.id,
                gender: memberModel.gender,
                born_date: memberModel.born_date,
                matricula: memberModel.matricula,
            },
        });
    }

    // Método para transformar a entidad Member (si es necesario)
    public toMemberEntity(): MemberProps {
        return {
            id: this.profile.id,
            user_id: this.id,
            gender: this.profile.gender,
            born_date: this.profile.born_date,
            matricula: this.profile.matricula,
        };
    }

    // Serialización a objeto plano
    public toJSON(): Record<string, any> {
        return {
            user: {
                id: this.id,
                name: this.name,
                last_name: this.last_name,
                email: this.email,
                phone: this.phone,
                confirmed: this.confirmed,
            },
            profile: this.profile,
        };
    }
}
