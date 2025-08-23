import { WorkoutProps } from "../../domain/entities";
import { WorkoutRepository } from "../../domain/interfaces";

export class GetAllWorksoutUseCase {
    constructor(private readonly _workoutRepository: WorkoutRepository) {}
    async execute(relationId: string): Promise<WorkoutProps[] | []> {
        const worksout = await this._workoutRepository.getAllByRelationId(
            relationId
        );
        console.log("Hola");
        return worksout;
    }
}
