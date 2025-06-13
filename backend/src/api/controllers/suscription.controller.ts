import type { NextFunction, Request, Response } from "express";
import { CreateSuscriptionUseCase } from "../../core/use-case/admin/suscriptions";

export class SuscriptionController {
    constructor(private createSuscriptionUseCase: CreateSuscriptionUseCase) {}

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, planId } = req.body;
            await this.createSuscriptionUseCase.execute(userId, planId);
            res.json({ message: "Suscripción creada" });
        } catch (error) {
            next(error);
        }
    }
}
