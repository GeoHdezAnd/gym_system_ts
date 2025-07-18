import type { NextFunction, Request, Response } from "express";
import {
    CreateSuscriptionUseCase,
    GetSuscriptionsUserUseCase,
} from "../../application/admin/suscriptions";

export class SuscriptionController {
    constructor(
        private _createSuscriptionUseCase: CreateSuscriptionUseCase,
        private _getAllSuscriptionsUserUseCase: GetSuscriptionsUserUseCase
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, planId } = req.body;
            await this._createSuscriptionUseCase.execute(userId, planId);
            res.json({ message: "Suscripción creada" });
        } catch (error) {
            next(error);
        }
    }

    async getAllByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const data = await this._getAllSuscriptionsUserUseCase.execute(
                userId
            );
            res.json( data );
        } catch (error) {
            next(error);
        }
    }
}
