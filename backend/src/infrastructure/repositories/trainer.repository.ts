import {
    TrainerDto,
    TrainerProfileDto,
} from "../../application/dtos/dashboard/trainer.dto";
import { TrainerProps } from "../../domain/entities";
import { TrainerRepository } from "../../domain/interfaces";
import { TrainerModel } from "../models";

export class SequelizeTrainerRepository implements TrainerRepository {
    async getAllWithProfile(): Promise<TrainerProfileDto[]> {
        
        return [];
    }

    async create(input: TrainerProps): Promise<TrainerProps> {
        const trainerModel = await TrainerModel.create({
            user_id: input.user_id,
            bio: input.bio,
            skills: input.skills,
            availability: input.availability,
            networks: input.networks,
        });

        return TrainerDto.fromSequelizeModel(trainerModel);
    }
}
