import { Member } from "../../domain/entities";
import { MemberRepository, MemberWithUser } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { MemberModel, UserModel } from "../models";

export class SequelizeMemberRepository implements MemberRepository {
    async getAll(): Promise<MemberWithUser[]> {
        const members = await MemberModel.findAll({
            include: [
                {
                    association: "userAccount", // nombre definido en el BelongsTo de mi modelo de member
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
                        "lastName",
                        "email",
                        "phone",
                        "confirmed",
                    ],
                },
            ],
            order: [
                [{ model: UserModel, as: "userAccount" }, "name", "ASC"],
                [{ model: UserModel, as: "userAccount" }, "lastName", "ASC"],
            ],
        });
        if (!members || members.length == 0) {
            throw new NotFoundError("No existen miembros registrados");
        }

        return members.map((member) => ({
            id: member.userAccount!.id,
            name: member.userAccount!.name,
            lastName: member.userAccount!.lastName,
            email: member.userAccount!.email,
            phone: member.userAccount!.phone,
            confirmed: member.userAccount!.confirmed,
            profile: {
                gender: member.gender,
                bornDate: member.bornDate,
                matricula: member.matricula,
            },
        }));
    }

    async create(member: Member): Promise<Member> {
        const memberModel = await MemberModel.create({
            userId: member.userId,
            gender: member.gender,
            bornDate: member.bornDate,
            matricula: member.matricula,
        });

        return new Member({
            id: memberModel.id,
            gender: memberModel.gender,
            bornDate: memberModel.bornDate,
            matricula: memberModel.matricula,
            userId: memberModel.userId,
        });
    }

    async findByUserId(userId: string): Promise<MemberWithUser | false> {
        const memberModel = await MemberModel.findOne({
            where: { userId },
            include: [
                {
                    association: "userAccount",
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
                        "lastName",
                        "email",
                        "phone",
                        "confirmed",
                    ],
                },
            ],
        });

        if (!memberModel?.userAccount) {
            return false;
        }
        return {
            id: memberModel.userAccount.id,
            name: memberModel.userAccount.name,
            lastName: memberModel.userAccount.lastName,
            email: memberModel.userAccount.email,
            phone: memberModel.userAccount.phone,
            confirmed: memberModel.userAccount.confirmed,
            profile: {
                id: memberModel.id,
                gender: memberModel.gender,
                bornDate: memberModel.bornDate,
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

    async getProfile(userId: string): Promise<Member | false> {
        const member = await MemberModel.findOne({ where: { userId } });

        if (!member) {
            throw new NotFoundError("Perfil no encontrado");
        }

        return new Member(member);
    }

    async save(member: Member): Promise<void> {
        //
        const memberProfile = await MemberModel.findOne({
            where: { userId: member.userId },
        });

        await memberProfile?.update({
            gender: member.gender,
            bornDate: member.bornDate,
            matricula: member.matricula,
        });
    }
}
