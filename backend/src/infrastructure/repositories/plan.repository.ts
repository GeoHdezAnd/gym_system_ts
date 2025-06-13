import { Plan, PlanProps } from "../../core/domain/entities";
import { PlanRepository } from "../../core/domain/interfaces";
import { PlansModel } from "../models";

export class SequelizePlanRepository implements PlanRepository {
    async getAll(): Promise<PlanProps[]> {
        const plans = await PlansModel.findAll({ where: { deleted: false } });
        return plans;
    }

    async create(plan: Plan): Promise<Plan> {
        const planNew = await PlansModel.create({
            name: plan.name,
            description: plan.description,
            benefits: plan.benefits,
            price: plan.price,
            durationDays: plan.durationDays,
        });
        return new Plan(planNew);
    }

    async findByName(name: string): Promise<PlanProps | false> {
        const planExists = await PlansModel.findOne({
            where: { name },
        });
        if (!planExists) {
            return false;
        }

        return planExists;
    }
    async findById(id: string): Promise<Plan | false> {
        const plan = await PlansModel.findByPk(id, {
            where: { deleted: false },
        });
        if (!plan) {
            return false;
        }
        return new Plan({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            benefits: plan.benefits,
            price: plan.price,
            durationDays: plan.durationDays,
            isActive: plan.isActive,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        });
    }

    async update(plan: Plan): Promise<void> {
        const planExists = await PlansModel.findByPk(plan.id!);
        await planExists?.update({
            name: plan.name,
            description: plan.description,
            benefits: plan.benefits,
            price: plan.price,
            durationDays: plan.durationDays,
            isActive: plan.isActive,
            deleted: plan.deleted,
        });
    }
}
