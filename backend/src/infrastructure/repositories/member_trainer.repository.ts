import { RequestPropsRelation } from "../../application/memberApp";
import { AdvisedDto, ResponseAdvisedDto } from "../../domain/dtos/advised.dto";
import { MemberTrainer } from "../../domain/entities";
import { MemberTrainerRepository } from "../../domain/interfaces";
import { MemberModel, MemberTrainerModel, UserModel } from "../models";

export class SequelizeMemberTrainerRepository
    implements MemberTrainerRepository
{
    async getByMemberId(member_id: string): Promise<MemberTrainer | null> {
        const model = await MemberTrainerModel.findOne({
            where: { member_id },
            include: [
                {
                    association: "trainer",
                    required: true,
                    include: [
                        {
                            association: "user_account",
                            required: true,
                            attributes: ["id", "name", "last_name", "phone"],
                        },
                    ],
                },
                {
                    association: "member",
                    required: true,
                    include: [
                        {
                            association: "user_account",
                            required: true,
                            attributes: ["id", "name", "last_name", "phone"],
                        },
                    ],
                    attributes: ["gender"],
                },
            ],
        });

        if (!model || !model.id) {
            return null;
        }
        return new MemberTrainer({
            id: model.id!,
            member_id: model?.member_id!,
            trainer_id: model.trainer_id,
            notes: model.notes || "",
            goal: model.goal || "",
            progress: model.progress,
            trainer_profile: {
                id: model.trainer?.user_account?.id!,
                name: model.trainer?.user_account?.name!,
                last_name: model.trainer?.user_account?.last_name!,
                phone: model.trainer?.user_account?.phone!,
            },

            member_profile: {
                id: model.member?.user_account?.id!,
                name: model.member?.user_account?.name!,
                last_name: model.member?.user_account?.last_name!,
                phone: model.member?.user_account?.phone!,
                gender: model.member?.gender!,
            },
        });
    }

    async getAdvisedByTrainerId(
        trainer_id: string
    ): Promise<ResponseAdvisedDto[] | []> {
        const advised = await MemberTrainerModel.findAll({
            where: { trainer_id },

            include: [
                {
                    model: MemberModel,
                    as: "member",
                    include: [
                        {
                            model: UserModel,
                            as: "user_account",
                            attributes: ["id", "name", "last_name", "phone"],
                        },
                    ],
                    attributes: ["gender"],
                },
            ],

            attributes: ["id", "goal"],
        });

        if (!advised.length) return [];

        return advised.map((advise) => AdvisedDto.toResponseAdvisedAll(advise));
    }

    async create(memberTrainer: MemberTrainer): Promise<MemberTrainer> {
        const model = await MemberTrainerModel.create({
            member_id: memberTrainer.member_id,
            trainer_id: memberTrainer.trainer_id,
            progress: memberTrainer.progress,
        });

        return new MemberTrainer(model);
    }

    async update(data: RequestPropsRelation): Promise<void> {
        const relationExists = await MemberTrainerModel.findByPk(data.id);
        await relationExists?.update({
            trainer_id: data.trainer_id,
            goal: data.goal,
            progress: data.progress,
            notes: data.notes,
        });
    }
}
