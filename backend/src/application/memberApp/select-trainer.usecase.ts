import { MemberTrainer } from "../../domain/entities";
import { NotFoundError } from "../../domain/errors";
import {
    MemberRepository,
    MemberTrainerRepository,
    TrainerRepository,
} from "../../domain/interfaces";

export class SelectTrainerUseCase {
    constructor(
        private readonly _memberRepository: MemberRepository,
        private readonly _trainerRepository: TrainerRepository,
        private readonly _memberTrainerRepository: MemberTrainerRepository
    ) {}

    async execute(memberId: string, trainerId: string) {
        // 1. Verificar que los usuarios existan
        const member = await this._memberRepository.findByUserId(memberId);

        const trainer = await this._trainerRepository.findByUserId(trainerId);
        if (!member || !trainer)
            throw new NotFoundError("Usuario no encontrado");

        // 2. Creamos la entidad
        const relation = new MemberTrainer({
            member_id: member.profile.id,
            trainer_id: trainer.profile.id,
        });

        // 3. Guardamos la entidad con el repo
        await this._memberTrainerRepository.create(relation);
    }
}
