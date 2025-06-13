import { Plan, PlanProps } from "../../../domain/entities";
import { PlanRepository } from "../../../domain/interfaces";
import { ConflictError } from "../../../errors";

export class CreatePlanUseCase {
    constructor(private planRepository: PlanRepository) {}

    async execute(input: PlanProps): Promise<void> {
        // 1. Verificamos que no exista un plan con el mismo nombre
        const planExists = await this.planRepository.findByName(input.name);
        if (planExists)
            throw new ConflictError("Ya existe plan con ese nombre");

        // Creamos el objeto de plan

        const plan = new Plan(input);
        await this.planRepository.create(plan);
    }
}
