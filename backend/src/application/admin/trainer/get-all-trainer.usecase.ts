import { TrainerRepository } from "../../../domain/interfaces";
import { ITrainerProfileDto } from "../../../domain/dtos/trainer.dto";

export class GetAllTrainersUseCase {
    constructor(private readonly _trainerRepository: TrainerRepository) {}

    async execute(): Promise<ITrainerProfileDto[] | []> {
        const res = await this._trainerRepository.getAllWithProfile();

        return res || [];
    }
}
