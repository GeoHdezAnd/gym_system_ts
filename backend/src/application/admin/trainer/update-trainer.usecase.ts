import { TrainerRequestDto } from "../../../domain/dtos/trainer.dto";
import { NotFoundError } from "../../../domain/errors";
import { TrainerRepository, UserRepository } from "../../../domain/interfaces";

export class UpdateTrainerUseCase {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _trainerRepository: TrainerRepository
    ) {}

    async execute(input: TrainerRequestDto, trainerId: string): Promise<void> {
        const userComplete = await this._userRepository.findById(trainerId);

        if (!userComplete) {
            throw new NotFoundError("No se encontro el usuario");
        }

        userComplete.updateByAdmin(input);
        await this._userRepository.save(userComplete);

        if (input.bio || input.skills) {
            const trainerProfile = await this._trainerRepository.getProfile(
                trainerId
            );

            if (!trainerProfile) {
                throw new NotFoundError("Perfil de entrenador no encontrado");
            }

            trainerProfile.updateProfile(input.bio, input.skills);

            await this._trainerRepository.save(trainerProfile);
        }
    }
}
