import { PlanProps } from "../../../domain/entities";
import { PlanRepository } from "../../../domain/interfaces";
import { NotFoundError } from "../../../errors";

export class UpdatePlanUseCase {
    constructor(private planRepository: PlanRepository) {}
    async execute(newData: PlanProps, planId: string): Promise<void> {
        // Obtenemos toda la entidad de plan para manejarla de manera segura
        const planExists = await this.planRepository.findById(planId);

        if (!planExists) {
            throw new NotFoundError("No se encontro el plan");
        }
        planExists.update(newData);

        await this.planRepository.update(planExists);
    }
}
