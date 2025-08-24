import { WorkoutProps } from "../../domain/entities";
import { WorkoutRepository } from "../../domain/interfaces";

export class GetWorkOutUseCase {
    constructor(private readonly _workOutRepository: WorkoutRepository) {}

    async execute(idWorkout: string): Promise<WorkoutProps> {
        const workOut = await this._workOutRepository.getById(idWorkout);
        return workOut;
    }
}
