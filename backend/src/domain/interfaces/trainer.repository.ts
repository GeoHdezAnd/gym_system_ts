import { TrainerProfileDto } from "../../application/dtos/dashboard/trainer.dto";
import { TrainerProps } from "../entities";

export interface TrainerRepository {
    getAllWithProfile(): Promise<TrainerProfileDto[] | []>;
    create(input: TrainerProps): Promise<TrainerProps>;
}
