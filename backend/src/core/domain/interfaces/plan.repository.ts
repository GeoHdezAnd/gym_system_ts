import { Plan, PlanProps } from "../entities";

export interface PlanRepository {
    getAll(): Promise<PlanProps[]>;
    create(plan: Plan): Promise<Plan>;
    findByName(name: string): Promise<PlanProps | false>;
    findById(id: string): Promise<Plan | false>;
    update(plan: Plan): Promise<void>;
}
