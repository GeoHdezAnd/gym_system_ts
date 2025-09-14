import { WorkoutRepository } from "../../domain/interfaces";

export class DeleteWorkOutUseCase {
    constructor(private readonly _workOutRepository: WorkoutRepository){}

    async execute(id: string) {
        await this._workOutRepository.deleteWorkOutById(id)
    }
}