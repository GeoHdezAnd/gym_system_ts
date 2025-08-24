import { WorkoutProps } from "../../domain/entities";
import { WorkoutRepository } from "../../domain/interfaces";

export class UpdateWorkOutUseCase {
    constructor(private readonly _workOutRepository: WorkoutRepository) {}

    async execute({ id, input }: { id: string; input: WorkoutProps }) {
        const workOutNew = await this._workOutRepository.updateWorkOut({
            id,
            workout: input,
        });
        
        return workOutNew;
    }
}
