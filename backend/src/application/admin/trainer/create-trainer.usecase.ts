import { TrainerRepository, UserRepository } from "../../../domain/interfaces";
import { UserDomainService } from "../../../domain/services";
import { db } from "../../../infrastructure/config/db";
import {
    TrainerDto,
    ITrainerProfileDto,
    TrainerRequestDto,
} from "../../../domain/dtos/trainer.dto";

export class CreateTrainerUseCase {
    constructor(
        private _userDomainService: UserDomainService,
        private _userRepository: UserRepository,
        private _trainerRepository: TrainerRepository
    ) {}

    async execute(
        input: TrainerRequestDto
    ): Promise<ITrainerProfileDto | undefined> {
        // 1. Verificamos que el usuario exista
        await this._userDomainService.ensureUserDoesNotExist(
            input.email,
            input.phone
        );

        // 2. Obtener el Id de rol de entrenador
        const role = await this._userDomainService.getRoleorFail("trainer");

        // 3.Crear usuario
        const user = await this._userDomainService.buildUser(input, role.id);

        let result: ITrainerProfileDto | undefined;
        // Utilizamos transacciones para mejorar el desempeño de la base de datos
        try {
            await db.transaction(async () => {
                const createdUser = await this._userRepository.create(user);
                if (!createdUser) {
                    throw new Error("No fue posible crear el usuario");
                }
                // Creamos perfil de trainer
                const trainer = {
                    user_id: createdUser.id!,
                    bio: input.bio,
                    skills: input.skills,
                };

                if (!trainer) {
                    throw new Error(
                        "No fue posible crear el perfil de entrenador"
                    );
                }

                const createdTrainer = await this._trainerRepository.create(
                    trainer
                );

                console.log("Se guarda trainer");
                result = TrainerDto.fromSequelizeModelsToProfile(
                    createdUser,
                    createdTrainer
                );
            });

            return result;
        } catch (error) {
            console.log(error);
            throw new Error(
                "Error al registrar el entrenador, intente de nuevo"
            );
        }
    }
}
