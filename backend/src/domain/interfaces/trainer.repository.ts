import { ITrainerProfileDto, TrainerRequestDto } from "../dtos/trainer.dto";
import { Trainer, TrainerProps } from "../entities";

export interface TrainerRepository {
    getAllWithProfile(): Promise<ITrainerProfileDto[] | []>;
    getProfile(user_id: string): Promise<Trainer | false>;
    create(input: TrainerProps): Promise<TrainerProps>;
    findByUserId(user_id: string): Promise<ITrainerProfileDto | false>;
    save(input: TrainerProps): Promise<void>;
}
