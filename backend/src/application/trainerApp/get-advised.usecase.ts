import { NotFoundError } from "../../domain/errors";
import {
    MemberTrainerRepository,
    TrainerRepository,
} from "../../domain/interfaces";

export class GetAdvisedUseCase {
    constructor(
        private readonly _trainerRepository: TrainerRepository,
        private readonly _relationRepository: MemberTrainerRepository
    ) {}

    async execute(trainerId: string) {
        // 1. Verificar que exista el entrenador
        const trainer = await this._trainerRepository.findByUserId(trainerId);
        if (!trainer) {
            throw new NotFoundError("No existe el entrenador");
        }
        const advised = await this._relationRepository.getAdvisedByTrainerId(
            trainer.profile.id
        );

        return advised;
    }
}
