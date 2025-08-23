import { NotFoundError } from "../../domain/errors";
import {
    MemberTrainerRepository,
    TrainerRepository,
} from "../../domain/interfaces";

export type RequestPropsRelation = {
    id: string;
    member_id: string;
    trainer_id?: string;
    notes?: string;
    goal?: string;
    progress?: {
        weight: number;
    };
};

export class UpdateRelationUseCase {
    constructor(
        private readonly _relationRepository: MemberTrainerRepository,
        private readonly _trainerRepository: TrainerRepository
    ) {}

    async execute(newData: RequestPropsRelation) {
        const relation = await this._relationRepository.getByMemberId(
            newData.member_id
        );
        if (relation?.trainer_id !== newData.trainer_id) {
            const trainer = await this._trainerRepository.findByUserId(
                newData.trainer_id!
            );
            if (!trainer) {
                throw new NotFoundError("No existe el usuario");
            }

            newData.trainer_id = trainer.profile.id;
        }
        await this._relationRepository.update(newData);
    }
}
