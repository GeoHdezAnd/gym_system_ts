import { PlanProps } from "../../../domain/entities";
import { PlanRepository } from "../../../domain/interfaces";

export class GetAllPlansUseCase {
    constructor(private planRepository: PlanRepository) {}

    async execute(): Promise<PlanProps[]> {
        const plans = await this.planRepository.getAll();
        return plans;
    }
}
