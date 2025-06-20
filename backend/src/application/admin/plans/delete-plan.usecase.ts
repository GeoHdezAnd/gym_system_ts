import { PlanRepository } from "../../../domain/interfaces";
import { NotFoundError } from "../../../domain/errors";

export class DeletePlanUseCase {
    constructor(private planRepository: PlanRepository) {}

    async execute(planId: string): Promise<void> {
        const plan = await this.planRepository.findById(planId);
        if (!plan) {
            throw new NotFoundError("Plan no encontrado");
        }

        plan.softDelete();

        await this.planRepository.update(plan);
    }
}
