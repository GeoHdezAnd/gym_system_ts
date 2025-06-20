import type { NextFunction, Request, Response } from "express";
import {
    CreatePlanUseCase,
    UpdatePlanUseCase,
    DeletePlanUseCase,
    GetAllPlansUseCase,
} from "../../application/admin/plans";

export class PlanController {
    constructor(
        private getPlansUseCase: GetAllPlansUseCase,
        private createPlanUseCase: CreatePlanUseCase,
        private updatePlanUseCase: UpdatePlanUseCase,
        private deletePlanUseCase: DeletePlanUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await this.getPlansUseCase.execute();
            res.json(plans);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, benefits, price, duration_days } =
                req.body;
            const newPlan = await this.createPlanUseCase.execute({
                name,
                description,
                benefits,
                price,
                durationDays: duration_days,
            });
            res.json({
                success: true,
                message: "Plan creando correctamente",
                newPlan,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({
                name: req.plan?.name,
                description: req.plan?.description,
                benefits: req.plan?.benefits,
                price: req.plan?.price,
                durationDays: req.plan?.durationDays,
                isActive: req.plan?.isActive,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, benefits, price, duration_days } =
                req.body;

            await this.updatePlanUseCase.execute(
                {
                    name,
                    description,
                    benefits,
                    price,
                    durationDays: duration_days,
                },
                req.plan!.id!
            );

            res.json("Plan actualizado correctamente");
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.deletePlanUseCase.execute(req.plan!.id!);
            res.json("Plan eliminado con soft delete");
        } catch (error) {
            next(error);
        }
    }
}
