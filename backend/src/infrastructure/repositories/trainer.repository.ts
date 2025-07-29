import {
    TrainerDto,
    ITrainerProfileDto,
    TrainerRequestDto,
} from "../../domain/dtos/trainer.dto";
import { Trainer, TrainerProps } from "../../domain/entities";
import { NotFoundError } from "../../domain/errors";
import { TrainerRepository } from "../../domain/interfaces";
import { TrainerModel, UserModel } from "../models";

export class SequelizeTrainerRepository implements TrainerRepository {
    async getAllWithProfile(): Promise<ITrainerProfileDto[]> {
        const userWhereClause: any = { deleted: false };
        const rows = await TrainerModel.findAll({
            include: [
                {
                    association: "user_account",
                    required: true,
                    where: userWhereClause,
                    include: [
                        {
                            association: "role",
                            where: { name: "trainer" },
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
                [
                    { model: UserModel, as: "user_account" },
                    "created_at",
                    "DESC",
                ],
            ],
        });

        const trainers = rows.map((trainer: TrainerModel) =>
            TrainerDto.fromSequelizeModelsToProfile(trainer.user_account!, {
                id: trainer.id,
                user_id: trainer.user_id,
                bio: trainer.bio,
                skills: trainer.skills,
            })
        );
        return trainers || [];
    }

    async getProfile(user_id: string): Promise<Trainer | false> {
        const trainerModel = await TrainerModel.findOne({ where: { user_id } });
        if (!trainerModel) {
            throw new NotFoundError("Perfil de entrenador no encontrado");
        }
        return new Trainer(trainerModel);
    }

    async create(input: TrainerProps): Promise<TrainerProps> {
        const trainerModel = await TrainerModel.create({
            user_id: input.user_id,
            bio: input.bio!,
            skills: input.skills,
        });

        return TrainerDto.fromSequelizeModel(trainerModel);
    }

    async findByUserId(user_id: string): Promise<ITrainerProfileDto | false> {
        const trainerModel = await TrainerModel.findOne({
            where: { user_id },
            include: [
                {
                    association: "user_account",
                    required: true,
                    include: [
                        {
                            association: "role",
                            where: { name: "trainer" },
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

        if (!trainerModel?.user_account) {
            return false;
        }
        return TrainerDto.fromSequelizeModelsToProfile(
            trainerModel.user_account,
            {
                user_id: trainerModel.id,
                bio: trainerModel.bio,
                skills: trainerModel.skills,
            }
        );
    }

    async save(trainer: TrainerProps): Promise<void> {
        const trainerProfile = await TrainerModel.findOne({
            where: { user_id: trainer.user_id },
        });

        await trainerProfile?.update({
            bio: trainer.bio,
            skills: trainer.skills,
        });
    }
}
