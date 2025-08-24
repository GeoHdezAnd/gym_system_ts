import { WorkoutProps } from "../../domain/entities";
import { WorkoutRepository } from "../../domain/interfaces";

export class CreateWorkoutUseCase {
    constructor(private readonly _workoutRepository: WorkoutRepository) {}

    async execute(input: WorkoutProps) {
        const workOut = await this._workoutRepository.createWorkOut(input);
        return workOut;
    }
}
