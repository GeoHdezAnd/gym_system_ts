import { TrainerRepository } from "../../../domain/interfaces";
import { TrainerProfileDto } from "../../dtos/dashboard/trainer.dto";

export class GetAllTrainersUseCase {
    constructor(private readonly _trainerRepository: TrainerRepository) {}

    async execute(): Promise<TrainerProfileDto[] | []> {
        const res = await this._trainerRepository.getAllWithProfile();

        return res || [];
    }
}
