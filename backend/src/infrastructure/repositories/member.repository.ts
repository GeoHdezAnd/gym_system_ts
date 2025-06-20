import { Member } from "../../domain/entities";
import { MemberRepository, MemberWithUser } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { MemberModel, UserModel } from "../models";

export class SequelizeMemberRepository implements MemberRepository {
    async getAll(): Promise<MemberWithUser[]> {
        const members = await MemberModel.findAll({
            include: [
                {
                    association: "user_account", // nombre definido en el BelongsTo de mi modelo de member
                    required: true,
                    where: {
                        deleted: false,
                    },
                    include: [
                        {
                            association: "role",
                            where: { name: "member" },
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
            order: [
                [{ model: UserModel, as: "user_account" }, "name", "ASC"],
                [{ model: UserModel, as: "user_account" }, "last_name", "ASC"],
            ],
        });
        if (!members || members.length == 0) {
            throw new NotFoundError("No existen miembros registrados");
        }

        return members.map((member) => ({
            id: member.user_account!.id,
            name: member.user_account!.name,
            last_name: member.user_account!.last_name,
            email: member.user_account!.email,
            phone: member.user_account!.phone,
            confirmed: member.user_account!.confirmed,
            profile: {
                gender: member.gender,
                born_date: member.born_date,
                matricula: member.matricula,
            },
        }));
    }

    async create(member: Member): Promise<Member> {
        const memberModel = await MemberModel.create({
            user_id: member.user_id,
            gender: member.gender,
            born_date: member.born_date,
            matricula: member.matricula,
        });

        return new Member({
            id: memberModel.id,
            gender: memberModel.gender,
            born_date: memberModel.born_date,
            matricula: memberModel.matricula,
            user_id: memberModel.user_id,
        });
    }

    async findByUserId(user_id: string): Promise<MemberWithUser | false> {
        const memberModel = await MemberModel.findOne({
            where: { user_id },
            include: [
                {
                    association: "user_account",
                    required: true,
                    include: [
                        {
                            association: "role",
                            where: { name: "member" },
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

        if (!memberModel?.user_account) {
            return false;
        }
        return {
            id: memberModel.user_account.id,
            name: memberModel.user_account.name,
            last_name: memberModel.user_account.last_name,
            email: memberModel.user_account.email,
            phone: memberModel.user_account.phone,
            confirmed: memberModel.user_account.confirmed,
            profile: {
                id: memberModel.id,
                gender: memberModel.gender,
                born_date: memberModel.born_date,
                matricula: memberModel.matricula,
            },
        };
    }

    async findByMatricula(matricula: string): Promise<Member | false> {
        const member = await MemberModel.findOne({ where: { matricula } });
        if (!member) {
            return false;
        }

        return new Member(member);
    }

    async getProfile(user_id: string): Promise<Member | false> {
        const member = await MemberModel.findOne({ where: { user_id } });

        if (!member) {
            throw new NotFoundError("Perfil no encontrado");
        }

        return new Member(member);
    }

    async save(member: Member): Promise<void> {
        //
        const memberProfile = await MemberModel.findOne({
            where: { user_id: member.user_id },
        });

        await memberProfile?.update({
            gender: member.gender,
            born_date: member.born_date,
            matricula: member.matricula,
        });
    }
}
