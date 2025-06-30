import { Member } from "../../domain/entities";
import {
    FilterOptions,
    MemberRepository,
    PaginationOptions,
} from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { MemberModel, UserModel } from "../models";
import { MemberWithUserDto } from "../../application/auth/dtos/response";
import { Op } from "@sequelize/core";

export class SequelizeMemberRepository implements MemberRepository {
    async getAll(
        pagination?: PaginationOptions,
        filters?: FilterOptions
    ): Promise<{
        members: MemberWithUserDto[];
        total: number;
    }> {
        const { page = 1, limit = 10 } = pagination || {};
        const { search } = filters || {};

        const whereClause: any = {};
        const userWhereClause: any = { deleted: false };

        if (search) {
            userWhereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
            ];
        }
        const { count, rows } = await MemberModel.findAndCountAll({
            where: whereClause,
            include: [
                {
                    association: "user_account", // nombre definido en el BelongsTo de mi modelo de member
                    required: true,
                    where: userWhereClause,
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
            limit: limit,
            offset: (page - 1) * limit,
        });

        const members = rows.map((member: MemberModel) =>
            MemberWithUserDto.fromSequelizeModels(member, member.user_account)
        );

        return { members, total: count };
    }

    async create(member: Member): Promise<Member> {
        const memberModel = await MemberModel.create({
            user_id: member.user_id,
            gender: member.gender,
            born_date: member.born_date,
            matricula: member.matricula,
        });

        return new Member(memberModel);
    }

    async findByUserId(user_id: string): Promise<MemberWithUserDto | false> {
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
        return MemberWithUserDto.fromSequelizeModels(
            memberModel,
            memberModel.user_account
        );
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
